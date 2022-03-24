import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";
import Spell from "./Spell";

export enum SpellSlot {
    Q = 'Q',
    W = 'W',
    E = 'E',
    R = 'R',
    D = 'D',
    F = 'F'
}

class GameObject {

    public name: string;
    public health: number;
    public maxHealth: number;

    private spells: Map<SpellSlot, Spell> = new Map<SpellSlot, Spell>();

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) {
        this.name = memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectName, memoryjs.STRING);
        this.health = memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectHealth, memoryjs.FLOAT);
        this.maxHealth = memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectMaxHealth, memoryjs.FLOAT);
        
        this.spells = new Map<SpellSlot, Spell>();
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        this.spells = new Map<SpellSlot, Spell>();

        const spellBook = memoryjs.readMemory(
            this.core.process.handle, 
            this.address + Offsets.ObjectSpellBook, 
            memoryjs.INT
        );

        if(spellBook < 0) return this.spells;

        const spellBookArray = memoryjs.readBuffer(
            this.core.process.handle, 
            spellBook + Offsets.ObjectSpellBookArray,
            Object.keys(SpellSlot).length * 4
        );

        for(var i = 0; i < Object.keys(SpellSlot).length; i++) {
            const spellAddress = Core.readIntegerFromBuffer(spellBookArray, i * 4);
            const spell = new Spell(this.core, spellAddress);

            const slot = Object.values(SpellSlot)[i] as SpellSlot;
            this.spells.set(slot, spell);
        }

        return this.spells;
    }

}

export default GameObject;