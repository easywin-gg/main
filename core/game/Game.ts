import Core from "../Core";
import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";
import GameObject from "./GameObject";

const MAX_UNITS = 500;

export enum UnitType {
    CHAMPIONS = 0,
    MINIONS = 1,
    JUNGLE = 2,
    TURRETS = 3,
    MISSILES = 4,
    OTHERS = 5
}

class Game {

    public cachedObjects: Map<UnitType, GameObject[]>;
    public localPlayer: GameObject

    constructor(
        private readonly core: Core
    ) {
        const localPlayer = memoryjs.readMemory(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.LocalPlayer,
            memoryjs.INT
        );

        this.cachedObjects = new Map<UnitType, GameObject[]>();
        this.localPlayer = new GameObject(this.core, localPlayer);
    }

    getGameTime(): number {
        return memoryjs.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);;
    }

    updateObjectCache() {
        const objectManager = memoryjs.readMemory(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.ObjectManager,
            memoryjs.INT
        );

        if (objectManager <= 0) return;

        this.cachedObjects = new Map<UnitType, GameObject[]>();

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
                const object = new GameObject(this.core, pointer);
                const name = object.getName();
                console.log(name);

                if (name.length <= 2 || !/^[ -~\t\n\r]+$/.test(name)) return;
 
                this.pushObjectInCache(UnitType.OTHERS, object);
            } catch { }
        }
    }

    private pushObjectInCache(type: UnitType, object: GameObject) {
        if (!this.cachedObjects.has(type)) {
            this.cachedObjects.set(type, []);
        }

        this.cachedObjects.get(type)?.push(object);
    }
}

export default Game;