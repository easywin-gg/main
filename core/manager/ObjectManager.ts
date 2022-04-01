import Offsets from "../game/offsets/Offsets";
import GameObject from "../game/GameObject";
import { UnitTag } from "../ddragon/DDragonUnit";
import Memory from "../memory/Memory";
import memoryjs from 'memoryjs';
import Game from "../game/Game";

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

    public static blacklistedObjectNames = [
        "testcube",
        "testcuberender",
        "testcuberender10vision",
        "s5test_wardcorpse",
        "sru_camprespawnmarker",
        "sru_plantrespawnmarker",
        "preseason_turret_shield"
    ];

    public blacklistedObjects: number[] = [];

    public readObjectsFromMemory(game: Game) {
        const objectManager = Memory.readMemory(
            Memory.module.modBaseAddr + Offsets.ObjectManager,
            memoryjs.INT
        );

        if (objectManager <= 0) return;

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

            const data = Memory.readBuffer(node, 0x18);

            for (var i = 0; i < 3; i++) {
                var child_address = Memory.readIntegerFromBuffer(data, i * 4);
                if (units.includes(child_address)) continue;

                nodes.push(child_address);
            }

            const networkId = Memory.readIntegerFromBuffer(data, Offsets.MapNodeNetId);
            if (networkId <= 0 || (networkId - 0x40000000 > 0x100000)) continue;

            if (this.blacklistedObjects.includes(networkId)) continue;

            const address = Memory.readIntegerFromBuffer(data, Offsets.MapNodeObject);
            if (address <= 0) continue;

            try {
                this.scanUnit(game, address);
            } catch { }
        }
    }

    public clearMissing(game: Game) {
        const missing = Array.from(game.objects.keys())
            .filter(key => !game.updatedThisFrame.has(key));

        for (const networkId of missing) {
            game.objects.delete(networkId);

            const champion = Array.from(game.champions.values())
                .find(o => o.networkId === networkId);

            if (champion) {
                game.champions.delete(champion);
            }
        }
    }

    private scanUnit(game: Game, address: number) {
        const networkId = Memory.readIntegerFromBuffer(Memory.readBuffer(
            address + Offsets.ObjectNetworkID,
            4,
        ), 0);

        const object = game.objects.get(networkId) || new GameObject(address);
        object.loadFromMemory();
        game.objects.set(
            (object.networkId && object.networkId !== networkId) ? object.networkId : networkId,
            object
        );

        if (object.networkId != 0) {
            game.updatedThisFrame.add(object.networkId);
            if (object.name.length <= 2
                || !/^[ -~\t\n\r]+$/.test(object.name)
                || ObjectManager.blacklistedObjectNames.includes(object.name.toLowerCase())
                || object.tags.length <= 0
            ) {
                this.blacklistedObjects.push(object.networkId);
                return;
            }
        }

        if (object?.type === UnitType.CHAMPION) {
            game.champions.add(
                object
            );
        }
    }
}

export default ObjectManager;