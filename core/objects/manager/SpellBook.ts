import GameObject from "../../GameObject";
import Memory from "../../memory/Memory";
import Offsets from "../../offsets/Offsets";
import Spell, { SpellSlot } from "../Spell";

class SpellBook {

    public spells: Map<number, Spell>;

    constructor(
        private readonly owner: GameObject,
        spellBookPointer: number
    ) {
        this.spells = this.loadSpellBook(spellBookPointer);
    }

    public getSpell(slot: number): Spell | undefined {
        return this.spells.get(slot);
    }

    public canUseSpell(slot: number): boolean {
        const spell = this.getSpell(slot);
        return spell != null && spell.isReady();
    }

    public loadSpellBook(spellBookAddress: number): Map<number, Spell> {
        const spells = new Map<number, Spell>();

        const spellBookArray = Memory.readBuffer(
            spellBookAddress + Offsets.ObjectSpellBookArray,
            Object.keys(SpellSlot).length * 4
        );

        for (var i = 0; i < Object.keys(SpellSlot).length; i++) {
            const spellAddress = Memory.readIntegerFromBuffer(spellBookArray, i * 4);

            try {
                const spell = new Spell(spellAddress);
                const slot = Object.values(SpellSlot)[i];
                spells.set(slot, spell);
            } catch { }
        }

        return spells;
    }
}

export default SpellBook;