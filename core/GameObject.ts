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

class GameObject {

    public static recallStateType = new Map<number, RecallInfo>([
        [6, { displayName: "Odin_Recall", duration: 8000 }],
        [11, { displayName: "Super_Recall", duration: 4000 }],
        [16, { displayName: "Teleporting", duration: 4000 }],
        [19, { displayName: "Stand_United", duration: 3000 }],
        [10, { displayName: "Yuumi_W_Ally", duration: 0 }],
    ]);

    public static getGameTime = (): number => {
        return Memory.readMemory(Offsets.GameTime, memoryjs.FLOAT);
    }

    public unit: DDragonUnit;

    private name: string;
    private team: number;
    private spellBook: number;
    private type: UnitType;

    constructor(private readonly baseAddress: number) {
        this.name = Memory.readMemory(
            Memory.readMemory(this.baseAddress + Offsets.ObjectName, memoryjs.DWORD),
            memoryjs.STRING
        );

        this.team = Memory.readMemory(this.baseAddress + Offsets.ObjectTeam, memoryjs.INT);
        this.spellBook = Memory.readMemory(this.baseAddress + Offsets.ObjectSpellBook, memoryjs.INT);
        this.type = this.getUnitType();

        this.unit = new DDragonUnit(this.name);
    }

    public isAlive() {
        return this.getHealth() > 0 && (
            this.getUnitType() === UnitType.CHAMPION ? this.getSpawnCount() % 2 == 0 : true
        );
    }

    public isDead() {
        return this.isAlive() === false;
    }

    public isTargetable() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectTargetable, memoryjs.BOOLEAN);
    }

    public isVisible() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectVisibility, memoryjs.BOOLEAN);
    }

    public getNetworkId() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectNetworkID, memoryjs.INT);
    }

    public getName() {
        return this.name;
    }

    public getTeam() {
        return this.team;
    }

    public getHealth() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectHealth, memoryjs.FLOAT);
    }

    public getLevel() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectLevel, memoryjs.INT);
    }

    public getMaxHealth() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectMaxHealth, memoryjs.FLOAT);
    }

    public getAttackSpeedMultiplier() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectAttackSpeedMultiplier, memoryjs.FLOAT);
    }

    public getAttackRange() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectAttackRange, memoryjs.FLOAT);
    }

    public getSizeMultiplier() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectSizeMultiplier, memoryjs.FLOAT);
    }

    public getSpawnCount() {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectSpawnCount, memoryjs.INT);
    }

    public getRecallState(): RecallInfo | undefined {
        const state = Memory.readMemory(
            this.baseAddress + Offsets.ObjectRecallState,
            memoryjs.INT
        );

        return GameObject.recallStateType.get(state);
    }

    public getBuffManager(): Map<string, Buff> {
        const buffEntryStart = Memory.readMemory(
            this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesStart,
            memoryjs.INT
        );

        const buffEntryEnd = Memory.readMemory(
            this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesEnd,
            memoryjs.INT
        );

        if (buffEntryStart <= 0 || buffEntryEnd <= 0) new Map();
        return Buff.loadBuffManager(buffEntryStart, buffEntryEnd);
    }

    public getSpellBook(): Map<SpellSlot, Spell> {
        if (this.spellBook <= 0) return new Map();
        return Spell.loadSpellBook(this.spellBook);
    }

    public getPosition(): Vector3 {
        return {
            x: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition, memoryjs.FLOAT),
            y: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition + 4, memoryjs.FLOAT),
            z: Memory.readMemory(this.baseAddress + Offsets.ObjectPosition + 8, memoryjs.FLOAT),
        };
    }

    public getType() {
        return this.type;
    }

    private getUnitType() {
        if (this.unit?.tags.includes(UnitTag.Unit_Champion)) {
            return UnitType.CHAMPION;
        }

        if (this.unit?.tags.includes(UnitTag.Unit_Minion_Lane)) {
            return UnitType.MINION;
        }

        if (this.unit?.tags.includes(UnitTag.Unit_Monster)) {
            return UnitType.JUNGLE;
        }

        if (this.unit?.tags.includes(UnitTag.Unit_Structure_Turret)) {
            return UnitType.TURRET;
        }

        return UnitType.OTHER;
    }
}

export default GameObject;
