import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";
import { SpellSlot } from "../GameObject";

class Spell {

    public level: number;
    public expiresAt: number;

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) {
        const data = memoryjs.readBuffer(
            this.core.process.handle,
            address,
            Offsets.SpellSlotSize
        );

        this.level = Core.readIntegerFromBuffer(data, Offsets.SpellSlotLevel);
        this.expiresAt = Core.readFloatFromBuffer(data, Offsets.SpellSlotCooldownExpire);
    }

    public static loadSpellBook(core: Core, spellBookAddress: number): Map<SpellSlot, Spell> {
        const spells = new Map<SpellSlot, Spell>();

        const spellBookArray = memoryjs.readBuffer(
            core.process.handle,
            spellBookAddress + Offsets.ObjectSpellBookArray,
            Object.keys(SpellSlot).length * 4
        );

        for (var i = 0; i < Object.keys(SpellSlot).length; i++) {
            const spellAddress = Core.readIntegerFromBuffer(spellBookArray, i * 4);

            try {
                const slot = Object.values(SpellSlot)[i] as SpellSlot;
                const spell = new Spell(core, spellAddress);
                spells.set(slot, spell);
            } catch {}
        }

        return spells;
    }
}

export default Spell;