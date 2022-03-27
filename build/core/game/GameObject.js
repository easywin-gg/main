"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellSlot = void 0;
const memoryjs_1 = __importDefault(require("memoryjs"));
const Buff_1 = __importDefault(require("./objects/Buff"));
const Spell_1 = __importDefault(require("./objects/Spell"));
const Offsets_1 = __importDefault(require("./offsets/Offsets"));
var SpellSlot;
(function (SpellSlot) {
    SpellSlot["Q"] = "Q";
    SpellSlot["W"] = "W";
    SpellSlot["E"] = "E";
    SpellSlot["R"] = "R";
    SpellSlot["D"] = "D";
    SpellSlot["F"] = "F";
})(SpellSlot = exports.SpellSlot || (exports.SpellSlot = {}));
class GameObject {
    constructor(core, address) {
        this.core = core;
        this.address = address;
    }
    getName() {
        return memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectName, memoryjs_1.default.STRING);
    }
    getHealth() {
        return memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectHealth, memoryjs_1.default.FLOAT);
    }
    getMaxHealth() {
        return memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectMaxHealth, memoryjs_1.default.FLOAT);
    }
    getPosition() {
        return {
            x: memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectPosition, memoryjs_1.default.FLOAT),
            y: memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectPosition + Offsets_1.default.ObjectPositionY, memoryjs_1.default.FLOAT),
            z: memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectPosition + Offsets_1.default.ObjectPositionZ, memoryjs_1.default.FLOAT)
        };
    }
    getBuffManager() {
        const buffEntryStart = memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectBuffManager + Offsets_1.default.ObjectBuffManagerEntriesStart, memoryjs_1.default.INT);
        const buffEntryEnd = memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectBuffManager + Offsets_1.default.ObjectBuffManagerEntriesEnd, memoryjs_1.default.INT);
        if (buffEntryStart <= 0 || buffEntryEnd <= 0)
            new Map();
        return Buff_1.default.loadBuffManager(this.core, buffEntryStart, buffEntryEnd);
    }
    getSpellBook() {
        const spellBook = memoryjs_1.default.readMemory(this.core.process.handle, this.address + Offsets_1.default.ObjectSpellBook, memoryjs_1.default.INT);
        if (spellBook <= 0)
            return new Map();
        return Spell_1.default.loadSpellBook(this.core, spellBook);
    }
}
exports.default = GameObject;
