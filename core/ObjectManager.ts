import Offsets from "./offsets/Offsets";
import GameObject from "./GameObject";
import Memory from "./memory/Memory";
import memoryjs from 'memoryjs';
import memory from "memoryjs";

const MAX_UNITS = 500;

export enum UnitType {
    CHAMPION = 0,
    MINION = 1,
    JUNGLE = 2,
    TURRET = 3,
    MISSILE = 4,
    OTHER = 5
} 

class ObjectManager {

    private static blacklistedObjectNames = [
        "testcube",
        "testcuberender",
        "testcuberender10vision",
        "s5test_wardcorpse",
        "sru_plantrespawnmarker",
        "preseason_turret_shield"
    ];

    private static blacklistedObjects: number[] = [];
    public static instance: ObjectManager;

    private readonly localPlayer: GameObject = new GameObject(
        Memory.readMemory(Memory.module.modBaseAddr + Offsets.LocalPlayer, memoryjs.INT)
    );

    public objects = new Map<number, GameObject>();
    public champions = new Set<GameObject>();

    public getLocalPlayer(): GameObject {
        this.localPlayer.loadFromMemory();
        return this.localPlayer;
    }

    public getObjectByNetworkId(id: number): GameObject | undefined {
        return this.objects.get(id);
    }

    public getHeroes(): GameObject[] {
        return Array.from(this.champions.values());
    }
    
    public getEnemyHeroes(): GameObject[] {
        const heroes = this.getHeroes();
        const team = this.getLocalPlayer().team;

        return heroes.filter(o => o.team !== team);
    }

    public getAllyHeroes(): GameObject[] {
        const heroes = this.getHeroes();
        const team = this.getLocalPlayer().team;

        return heroes.filter(o => o.team === team);
    }

    public getTurrets(): GameObject[] {
        return Array.from(this.objects.values()).filter(o => o.type === UnitType.TURRET);
    }

    public getEnemyTurrets(): GameObject[] {
        const turrets = this.getTurrets();
        const team = this.getLocalPlayer().team;

        return turrets.filter(o => o.team !== team);
    }

    public getAllyTurrets(): GameObject[] {
        const turrets = this.getTurrets();
        const team = this.getLocalPlayer().team;

        return turrets.filter(o => o.team === team);
    }

    public static readObjectsFromMemory() {
        const objectManager = Memory.readMemory(
            Memory.module.modBaseAddr + Offsets.ObjectManager,
            memoryjs.INT
        );

        if (objectManager <= 0) return;

        ObjectManager.instance.objects.clear();
        ObjectManager.instance.champions.clear();

        const units: number[] = [];
        const nodes: number[] = [
            Memory.readMemory(
                objectManager + Offsets.MapRoot,
                memoryjs.INT
            )
        ];

        while (nodes.length > 0 && units.length < MAX_UNITS) {
            const node = nodes.shift();
            if (!node) return;
            if (units.includes(node)) continue;

            units.push(node);

            // const data = Memory.readBuffer(node, 0x18);

            for (var i = 0; i < 3; i++) {
                var child_address = Memory.readMemory(node + (i * 4), memoryjs.INT);
                if (units.includes(child_address)) continue;

                nodes.push(child_address);
            }

            const networkId = Memory.readMemory(node + Offsets.MapNodeNetId, memoryjs.INT);
            if (networkId <= 0 || (networkId - 0x40000000 > 0x100000)) continue;

            if (this.blacklistedObjects.includes(networkId)) continue;

            const address = Memory.readMemory(node + Offsets.MapNodeObject, memoryjs.INT);
            if (address <= 0) continue;

            try {
                this.scanUnit(address);
            } catch { }
        }
    }

    private static scanUnit(address: number) {
        const object = new GameObject(address);
        object.loadFromMemory();

        if (object?.networkId == 0) return;

        ObjectManager.instance.objects.set(
            object.networkId,
            object
        );

        if (object.name.length <= 2
            || !/^[ -~\t\n\r]+$/.test(object.name)
            || ObjectManager.blacklistedObjectNames.includes(object.name.toLowerCase())
            || object.tags.length <= 0
        ) {
            this.blacklistedObjects.push(object.networkId);
            return;
        }

        if (object.type === UnitType.CHAMPION) {
            ObjectManager.instance.champions.add(
                object
            );
        }
     }
}

export default ObjectManager;