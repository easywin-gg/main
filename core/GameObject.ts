import Offsets from "./offsets/Offsets";
import DDragonUnit, { UnitTag } from "./ddragon/DDragonUnit";
import Memory from "./memory/Memory";
import { Vector3 } from "./renderer/GameRenderer";
import { UnitType } from "./ObjectManager";
import Buff from "./objects/Buff";
import memoryjs from "memoryjs";
import Spell, { SpellSlot } from "./objects/Spell";

export type RecallInfo = {
    displayName: string;
    duration: number;
}

class GameObject extends DDragonUnit {

    public static recallStateType = new Map<number, RecallInfo>([
        [6, { displayName: "Odin_Recall", duration: 8000 }],
        [11, { displayName: "Super_Recall", duration: 4000 }],
        [16, { displayName: "Teleporting", duration: 4000 }],
        [19, { displayName: "Stand_United", duration: 3000 }],
        [10, { displayName: "Yuumi_W_Ally", duration: 0 }],
    ]);

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

    private recallState!: number;
    private spellBook!: number;
    private buffEntryStart!: number;
    private buffEntryEnd!: number;

    constructor(private readonly baseAddress: number) {
        super(baseAddress);
    }

    public loadFromMemory() {
        this.team = Memory.readMemory(this.baseAddress + Offsets.ObjectTeam, memoryjs.INT);
        this.networkId = Memory.readMemory(this.baseAddress + Offsets.ObjectNetworkID, memoryjs.INT);

        this.position = {
            x: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition, memoryjs.FLOAT),
            y: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition + 4, memoryjs.FLOAT),
            z: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition + 8, memoryjs.FLOAT),
        };
        this.health = Memory.readMemory(this.baseAddress + Offsets.ObjectHealth, memoryjs.FLOAT);
        this.maxHealth = Memory.readMemory(this.baseAddress + Offsets.ObjectMaxHealth, memoryjs.FLOAT);
        this.isTargetable = Memory.readMemory(this.baseAddress + Offsets.ObjectTargetable, memoryjs.BOOLEAN);
        this.isVisible = Memory.readMemory(this.baseAddress + Offsets.ObjectVisibility, memoryjs.BOOLEAN);
        this.level = Memory.readMemory(this.baseAddress + Offsets.ObjectLevel, memoryjs.INT);
        this.attackSpeedMultiplier = Memory.readMemory(
            this.baseAddress + Offsets.ObjectAttackSpeedMultiplier,
            memoryjs.FLOAT
        );
        this.attackRange = Memory.readMemory(
            this.baseAddress + Offsets.ObjectAttackRange,
            memoryjs.FLOAT
        );
        this.sizeMultiplier = Memory.readMemory(
            this.baseAddress + Offsets.ObjectSizeMultiplier,
            memoryjs.FLOAT
        );

        this.type = this.getUnitType();

        if (this.type === UnitType.CHAMPION) {
            this.recallState = Memory.readMemory(
                this.baseAddress + Offsets.ObjectRecallState,
                memoryjs.INT
            );
            this.spawnCount = Memory.readMemory(
                this.baseAddress + Offsets.ObjectSpawnCount,
                memoryjs.INT
            );

            this.spellBook = Memory.readMemory(
                this.baseAddress + Offsets.ObjectSpellBook,
                memoryjs.INT
            );

            this.buffEntryStart = Memory.readMemory(
                this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesStart,
                memoryjs.INT
            );

            this.buffEntryEnd = Memory.readMemory(
                this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesEnd,
                memoryjs.INT
            );
        }
    }

    public isAlive() {
        return this.health > 0 && this.spawnCount % 2 == 0;
    }

    public isDead() {
        return this.isAlive() === false;
    }

    public getRecallState(): RecallInfo | undefined {
        return GameObject.recallStateType.get(this.recallState);
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
