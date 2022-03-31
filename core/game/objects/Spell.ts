import Offsets from "../offsets/Offsets";
import Memory from "../../memory/Memory";

export enum SpellSlot {
    Q = 'Q',
    W = 'W',
    E = 'E',
    R = 'R',
    D = 'D',
    F = 'F'
}

class Spell {

    public level: number;
    public expiresAt: number;

    constructor(protected readonly address: number) {
        const data = Memory.readBuffer(
            address,
            Offsets.SpellSlotSize
        );

        this.level = Memory.readIntegerFromBuffer(data, Offsets.SpellSlotLevel);
        this.expiresAt = Memory.readFloatFromBuffer(data, Offsets.SpellSlotCooldownExpire);
    }

    public static loadSpellBook(spellBookAddress: number): Map<SpellSlot, Spell> {
        const spells = new Map<SpellSlot, Spell>();

        const spellBookArray = Memory.readBuffer(
            spellBookAddress + Offsets.ObjectSpellBookArray,
            Object.keys(SpellSlot).length * 4
        );

        for (var i = 0; i < Object.keys(SpellSlot).length; i++) {
            const spellAddress = Memory.readIntegerFromBuffer(spellBookArray, i * 4);

            try {
                const slot = Object.values(SpellSlot)[i] as SpellSlot;
                const spell = new Spell(spellAddress);
                spells.set(slot, spell);
            } catch { }
        }

        return spells;
    }
}

export default Spell;