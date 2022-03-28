import Core from "../../Core";
import memoryjs from "memoryjs";
import Offsets from "../offsets/Offsets";
import GameObject from "../GameObject";
import { UnitTag } from "../ddragon/DDragonUnit";

const MAX_UNITS = 500;

export enum UnitType {
    CHAMPIONS = 0,
    MINIONS = 1,
    JUNGLE = 2,
    TURRETS = 3,
    MISSILES = 4,
    OTHERS = 5
}

class ObjectManager {

    public objects = new Map<UnitType, GameObject[]>();

    constructor(
        private readonly core: Core
    ) {
        this.read();
    }
    
    public read() {
        const objectManager = memoryjs.readMemory(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.ObjectManager,
            memoryjs.INT
        );

        if (objectManager <= 0) return;

        this.objects = new Map<UnitType, GameObject[]>();
        const mapRoot = memoryjs.readMemory(
            this.core.process.handle,
            objectManager + Offsets.MapRoot,
            memoryjs.INT
        );
 
        const units: number[] = [];
        let currentNode: { address: number, next: any } = {
            address: mapRoot,
            next: undefined
        };

        while (currentNode && units.length < MAX_UNITS) {
            if (units.includes(currentNode.address)) {
                currentNode = currentNode.next;
                continue;
            }

            units.push(currentNode.address);
            const data = memoryjs.readBuffer(this.core.process.handle, currentNode.address, 0x18);

            for (var i = 0; i < 3; i++) {
                var child_address = Core.readIntegerFromBuffer(data, i * 4);
                if (units.includes(child_address)) continue;

                currentNode.next = { address: child_address, next: currentNode.next }
            }

            this.scanUnit(data);
            currentNode = currentNode.next
        }
    }

    private scanUnit(data: Buffer) {
        const networkId = Core.readIntegerFromBuffer(data, Offsets.MapNodeNetId);
        if (networkId - 0x40000000 <= 0x100000) {
            const pointer = Core.readIntegerFromBuffer(data, Offsets.MapNodeObject);

            try {
                const object = new GameObject(this.core, pointer, UnitType.OTHERS);
                const name = object.getName();
                if (name.length <= 2 || !/^[ -~\t\n\r]+$/.test(name)) return;

                if(name === 'Jinx') {
                    console.log(`[ObjectManager] Found object: ${name} with tags`, object.tags);
                }

                if (object.tags.includes(UnitTag.Unit_Champion)) {
                    this.pushObjectInCache(UnitType.CHAMPIONS, object);
                } else if (object.tags.includes(UnitTag.Unit_Minion_Lane)) {
                    this.pushObjectInCache(UnitType.MINIONS, object);
                } else if (object.tags.includes(UnitTag.Unit_Monster)) {
                    this.pushObjectInCache(UnitType.JUNGLE, object);
                } else if (object.tags.includes(UnitTag.Unit_Structure_Turret)) {
                    this.pushObjectInCache(UnitType.TURRETS, object);
                } else {
                    this.pushObjectInCache(UnitType.OTHERS, object);
                }
            } catch { }
        }
    }

    private pushObjectInCache(type: UnitType, object: GameObject) {
        object.type = type;
        if (!this.objects.has(type)) {
            this.objects.set(type, []);
        }

        this.objects.get(type)?.push(object);
    }

}

export default ObjectManager;