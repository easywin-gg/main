"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("../app/Core"));
const memoryjs_1 = __importDefault(require("memoryjs"));
const Offsets_1 = __importDefault(require("./offsets/Offsets"));
const GameObject_1 = __importDefault(require("./GameObject"));
const GameRenderer_1 = __importDefault(require("./GameRenderer"));
const MAX_UNITS = 500;
class Game {
    constructor(core) {
        this.core = core;
        this.champions = [];
        this.minions = [];
        this.jungle = [];
        this.turrets = [];
        this.missiles = [];
        this.others = [];
        const localPlayer = memoryjs_1.default.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets_1.default.LocalPlayer, memoryjs_1.default.INT);
        this.localPlayer = new GameObject_1.default(this.core, localPlayer);
    }
    getGameTime() {
        return memoryjs_1.default.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets_1.default.GameTime, memoryjs_1.default.FLOAT);
        ;
    }
    getGameRenderer() {
        return new GameRenderer_1.default(this.core);
    }
    readObjects() {
        this.champions = [];
        this.minions = [];
        this.jungle = [];
        this.turrets = [];
        this.missiles = [];
        this.others = [];
        const objectManager = memoryjs_1.default.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets_1.default.ObjectManager, memoryjs_1.default.INT);
        if (objectManager <= 0)
            return;
        const mapRoot = memoryjs_1.default.readMemory(this.core.process.handle, objectManager + Offsets_1.default.MapRoot, memoryjs_1.default.INT);
        const visitedAddress = [];
        var unitsRead = 0;
        var currentNode = {
            address: mapRoot,
            next: undefined
        };
        while (currentNode && unitsRead < MAX_UNITS) {
            if (visitedAddress.includes(currentNode.address)) {
                currentNode = currentNode.next;
                continue;
            }
            visitedAddress.push(currentNode.address);
            const data = memoryjs_1.default.readBuffer(this.core.process.handle, currentNode.address, 0x18);
            unitsRead += 1;
            for (var i = 0; i < 3; i++) {
                var child_address = Core_1.default.readIntegerFromBuffer(data, i * 4);
                if (visitedAddress.includes(child_address))
                    continue;
                currentNode.next = { address: child_address, next: currentNode.next };
            }
            const networkId = Core_1.default.readIntegerFromBuffer(data, Offsets_1.default.MapNodeNetId);
            if (networkId - 0x40000000 <= 0x100000) {
                const pointer = Core_1.default.readIntegerFromBuffer(data, Offsets_1.default.MapNodeObject);
                try {
                    const object = new GameObject_1.default(this.core, pointer);
                    const name = object.getName();
                    if (name.length <= 2 || !/^[ -~\t\n\r]+$/.test(name))
                        continue;
                    this.others.push(object);
                }
                catch (_a) { }
            }
            currentNode = currentNode.next;
        }
    }
}
exports.default = Game;
