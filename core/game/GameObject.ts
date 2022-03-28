import memoryjs from 'memoryjs';
import Core from '../Core';
import { Vector3 } from './renderer/GameRenderer';
import Buff from './objects/Buff';
import Spell from './objects/Spell';
import Offsets from './offsets/Offsets';
import DDragonUnit from './ddragon/DDragonUnit';
import { UnitType } from './manager/ObjectManager';

export enum SpellSlot {
    Q = 'Q',
    W = 'W',
    E = 'E',
    R = 'R',
    D = 'D',
    F = 'F'
}

class GameObject extends DDragonUnit {

    private readonly networkId: number;

    constructor(
        protected readonly core: Core,
        protected readonly address: number,
        public type: UnitType
    ) {
        super(core.process, address);

        this.networkId = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectNetworkID,
            memoryjs.INT
        );
    }

    public getNetworkId(): number {
        return this.networkId;
    }

    public getPlayerName(): string {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectPlayerName, memoryjs.STRING);
    }

    public getTeam(): number {
        const team = memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectTeam, memoryjs.INT);
        console.log(team);
        return team;
    }

    public getLevel(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectLevel, memoryjs.INT);
    }

    public getHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectHealth, memoryjs.FLOAT);
    }

    public getMaxHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectMaxHealth, memoryjs.FLOAT);
    }

    public getArmor(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectArmor, memoryjs.FLOAT);
    }

    public getBaseAttack(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectBaseAtk, memoryjs.FLOAT);
    }

    public getBonusAttack(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectBonusAtk, memoryjs.FLOAT);
    }

    public getSizeMultiplier(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectSizeMultiplier, memoryjs.FLOAT);
    }

    public getAttackRange(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectAttackRange, memoryjs.FLOAT);
    }

    public getAttackSpeedMultiplier(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectAttackSpeedMultiplier, memoryjs.FLOAT);
    }

    public getSpawnCount(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectSpawnCount, memoryjs.INT);
    }

    public getPosition(): Vector3 {
        return {
            x: memoryjs.readMemory(
                this.core.process.handle,
                this.address + Offsets.ObjectPosition,
                memoryjs.FLOAT
            ),
            y: memoryjs.readMemory(
                this.core.process.handle,
                this.address + Offsets.ObjectPosition + Offsets.ObjectPositionY,
                memoryjs.FLOAT
            ),
            z: memoryjs.readMemory(
                this.core.process.handle,
                this.address + Offsets.ObjectPosition + Offsets.ObjectPositionZ,
                memoryjs.FLOAT
            )
        }
    }

    public isAlive(): boolean {
        return this.getSpawnCount() % 2 == 0;
    }

    public isTargetable(): boolean {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectTargetable, memoryjs.BOOLEAN)
    }

    public isVisible(): boolean {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectVisibility, memoryjs.BOOLEAN);
    }

    public isInvulnerable(): boolean {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectInvulnerable, memoryjs.BOOLEAN);
    }

    public isRecalling(): boolean {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.ObjectRecalling, memoryjs.BOOLEAN);
    }

    public getBuffManager(): Map<string, Buff> {
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

        if (buffEntryStart <= 0 || buffEntryEnd <= 0) new Map();
        return Buff.loadBuffManager(this.core, buffEntryStart, buffEntryEnd);
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        const spellBook = memoryjs.readMemory(
            this.core.process.handle,
            this.address + Offsets.ObjectSpellBook,
            memoryjs.INT
        );

        if (spellBook <= 0) return new Map();
        return Spell.loadSpellBook(this.core, spellBook);
    }

}

export default GameObject;