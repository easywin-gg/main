import memoryjs from 'memoryjs';
import Core from '../app/Core';
import Buff from './objects/Buff';
import Spell from './objects/Spell';
import Offsets from './offsets/Offsets';

export enum SpellSlot {
    Q = 'Q',
    W = 'W',
    E = 'E',
    R = 'R',
    D = 'D',
    F = 'F'
}

class GameObject {

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) {
    }

    public getName(): string {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectName, memoryjs.STRING);
    }

    public getHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectHealth, memoryjs.FLOAT);
    }

    public getMaxHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectMaxHealth, memoryjs.FLOAT);
    }

    public getBuffs(): Buff[] {
        const buffs: Buff[] = [];

        const buffEntryStart = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesStart,
            memoryjs.INT
        );

        const buffEntryEnd = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesEnd,
            memoryjs.INT
        );


        var currentAddress = buffEntryStart;
        while (currentAddress != buffEntryEnd) {
            const buffAddress = memoryjs.readMemory(
                this.core.process.handle,
                currentAddress,
                memoryjs.INT
            );

            try {
                const buff = new Buff(this.core, buffAddress);
                buffs.push(buff);
            } catch {};

            currentAddress += 0x8;
        }

        return buffs;
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        const spells = new Map<SpellSlot, Spell>();

        const spellBook = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectSpellBook,
            memoryjs.INT
        );

        if (spellBook < 0) return spells;

        const spellBookArray = memoryjs.readBuffer(
            this.core.process.handle,
            spellBook + Offsets.ObjectSpellBookArray,
            Object.keys(SpellSlot).length * 4
        );

        for (var i = 0; i < Object.keys(SpellSlot).length; i++) {
            const spellAddress = Core.readIntegerFromBuffer(spellBookArray, i * 4);

            try {
                const slot = Object.values(SpellSlot)[i] as SpellSlot;
                const spell = new Spell(this.core, spellAddress);
                spells.set(slot, spell);
            } catch {}
        }

        return spells;
    }

}

export default GameObject;