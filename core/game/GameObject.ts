import Offsets from './offsets/Offsets';
import DDragonUnit, { UnitTag } from '../ddragon/DDragonUnit';
import Memory from '../memory/Memory';
import { Vector3 } from '../renderer/GameRenderer';
import { UnitType } from '../manager/ObjectManager';
import Buff from './objects/Buff';
import memoryjs from 'memoryjs';
import Spell, { SpellSlot } from './objects/Spell';

class GameObject extends DDragonUnit {

    public id!: number;
    public networkId!: number;
    public team!: number;
    public position!: Vector3;
    public health!: number;
    public maxHealth!: number;
    public isTargetable!: boolean;
    public isVisible!: boolean;
    public type!: UnitType;

    public level!: number;
    public spawnCount!: number;
    public attackSpeedMultiplier!: number;
    public attackRange!: number;
    public sizeMultiplier!: number;

    private spellBook!: number;
    private buffEntryStart!: number;
    private buffEntryEnd!: number;

    constructor(
        private readonly baseAddress: number
    ) {
        super(baseAddress);
    }

    public loadFromMemory(data?: Buffer, deepLoad = true, buffSize = 0x3600) {
        if (!data) data = Memory.readBuffer(this.baseAddress, 0x3600);

        this.id = Memory.readIntegerFromBuffer(data, Offsets.ObjectArmor);
        this.team = Memory.readIntegerFromBuffer(data, Offsets.ObjectTeam);
        this.networkId = Memory.readIntegerFromBuffer(data, Offsets.ObjectNetworkID);
        this.position = {
            x: Memory.readFloatFromBuffer(data, Offsets.ObjectPosition),
            y: Memory.readFloatFromBuffer(data, Offsets.ObjectPosition + 4),
            z: Memory.readFloatFromBuffer(data, Offsets.ObjectPosition + 8)
        };
        this.health = Memory.readFloatFromBuffer(data, Offsets.ObjectHealth);
        this.maxHealth = Memory.readFloatFromBuffer(data, Offsets.ObjectMaxHealth);
        this.isTargetable = Memory.readIntegerFromBuffer(data, Offsets.ObjectTargetable) === 1;
        this.isVisible = Memory.readMemory(this.baseAddress + Offsets.ObjectVisibility, memoryjs.BOOLEAN);

        this.level = Memory.readIntegerFromBuffer(data, Offsets.ObjectLevel);
        this.attackSpeedMultiplier = Memory.readFloatFromBuffer(data, Offsets.ObjectAttackSpeedMultiplier);
        this.attackRange = Memory.readFloatFromBuffer(data, Offsets.ObjectAttackRange);
        this.sizeMultiplier = Memory.readFloatFromBuffer(data, Offsets.ObjectSizeMultiplier);

        this.type = this.getUnitType();
        
        if (this.type === UnitType.CHAMPION) {
            this.spawnCount = Memory.readMemory(this.baseAddress + Offsets.ObjectSpawnCount, memoryjs.INT);
            
            this.spellBook = Memory.readIntegerFromBuffer(data, Offsets.ObjectSpellBook);
            
            this.buffEntryStart = Memory.readIntegerFromBuffer(
                data,
                Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesStart,
                );
                
                this.buffEntryEnd = Memory.readIntegerFromBuffer(
                    data,
                    Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesEnd,
                    );
                }
    }

    public isAlive() {
        return this.health > 0 && (this.spawnCount %2 == 0);
    }

    public getBuffManager(): Map<string, Buff> {
        if (this.buffEntryStart <= 0 || this.buffEntryEnd <= 0) new Map();
        return Buff.loadBuffManager(this.buffEntryStart, this.buffEntryEnd);
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        if (this.spellBook <= 0) return new Map();
        return Spell.loadSpellBook(this.spellBook);
    }

    private getUnitType() {
        if (this.tags.includes(UnitTag.Unit_Champion)) {
            return UnitType.CHAMPION;
        }

        if (this.tags.includes(UnitTag.Unit_Minion_Lane)) {
            return UnitType.MINION;
        }

        if (this.tags.includes(UnitTag.Unit_Monster)) {
            return UnitType.JUNGLE;
        }

        if (this.tags.includes(UnitTag.Unit_Structure_Turret)) {
            return UnitType.TURRET;
        }

        return UnitType.OTHER;
    }
}

export default GameObject;