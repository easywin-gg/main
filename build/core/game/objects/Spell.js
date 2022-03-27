"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("../../app/Core"));
const memoryjs_1 = __importDefault(require("memoryjs"));
const Offsets_1 = __importDefault(require("../offsets/Offsets"));
const GameObject_1 = require("../GameObject");
class Spell {
    constructor(core, address) {
        this.core = core;
        this.address = address;
        const data = memoryjs_1.default.readBuffer(this.core.process.handle, address, Offsets_1.default.SpellSlotSize);
        this.level = Core_1.default.readIntegerFromBuffer(data, Offsets_1.default.SpellSlotLevel);
        this.expiresAt = Core_1.default.readFloatFromBuffer(data, Offsets_1.default.SpellSlotCooldownExpire);
    }
    static loadSpellBook(core, spellBookAddress) {
        const spells = new Map();
        const spellBookArray = memoryjs_1.default.readBuffer(core.process.handle, spellBookAddress + Offsets_1.default.ObjectSpellBookArray, Object.keys(GameObject_1.SpellSlot).length * 4);
        for (var i = 0; i < Object.keys(GameObject_1.SpellSlot).length; i++) {
            const spellAddress = Core_1.default.readIntegerFromBuffer(spellBookArray, i * 4);
            try {
                const slot = Object.values(GameObject_1.SpellSlot)[i];
                const spell = new Spell(core, spellAddress);
                spells.set(slot, spell);
            }
            catch (_a) { }
        }
        return spells;
    }
}
exports.default = Spell;
