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

        if(buffEntryStart <= 0 || buffEntryEnd <= 0) return [];
        return Buff.loadBuffManager(this.core, buffEntryStart, buffEntryEnd);
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        const spellBook = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectSpellBook,
            memoryjs.INT
        );

        if (spellBook <= 0) return new Map<SpellSlot, Spell>();
        return Spell.loadSpellBook(this.core, spellBook);
    }

}

export default GameObject;