import Offsets from "./offsets/Offsets";
import DDragonUnit, { UnitTag } from "./ddragon/DDragonUnit";
import Memory from "./memory/Memory";
import { Vector3 } from "./renderer/GameRenderer";
import { UnitType } from "./ObjectManager";
import memoryjs from "memoryjs";
import BuffManager from "./objects/manager/BuffManager";
import SpellBook from "./objects/manager/SpellBook";

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
    private spellBookPointer: number;
    private type: number;

    constructor(private readonly baseAddress: number) {
        this.name = Memory.readMemory(
            Memory.readMemory(this.baseAddress + Offsets.ObjectName, memoryjs.DWORD),
            memoryjs.STRING
        );
        this.team = Memory.readMemory(this.baseAddress + Offsets.ObjectTeam, memoryjs.INT);
        this.spellBookPointer = Memory.readMemory(this.baseAddress + Offsets.ObjectSpellBook, memoryjs.INT);

        this.type = this.getUnitType();
        this.unit = new DDragonUnit(this.name);
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

    public getBuffManager(): BuffManager | undefined {
        const buffEntryStart = Memory.readMemory(
            this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesStart,
            memoryjs.INT
        );

        const buffEntryEnd = Memory.readMemory(
            this.baseAddress + Offsets.ObjectBuffManager + Offsets.ObjectBuffManagerEntriesEnd,
            memoryjs.INT
        );

        if (buffEntryStart <= 0 || buffEntryEnd <= 0) return;
        return new BuffManager(this, buffEntryStart, buffEntryEnd);
    }

    public getSpellBook(): SpellBook | undefined {
        if (this.spellBookPointer <= 0) return;
        return new SpellBook(this, this.spellBookPointer);
    }

    public getPosition(): Vector3 {
        return Memory.readMemory(this.baseAddress + Offsets.ObjectPosition, memoryjs.VEC3);
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
