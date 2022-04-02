import fs from 'fs';
import memoryjs from 'memoryjs';
import Memory from '../memory/Memory';
import Offsets from '../offsets/Offsets';

export enum UnitTag {
    Unit_ = 1,
    Unit_Champion = 2,
    Unit_Champion_Clone = 3,
    Unit_IsolationNonImpacting = 4,
    Unit_KingPoro = 5,
    Unit_Minion = 6,
    Unit_Minion_Lane = 7,
    Unit_Minion_Lane_Melee = 8,
    Unit_Minion_Lane_Ranged = 9,
    Unit_Minion_Lane_Siege = 10,
    Unit_Minion_Lane_Super = 11,
    Unit_Minion_Summon = 12,
    Unit_Minion_SummonName_game_character_displayname_ZyraSeed = 13,
    Unit_Minion_Summon_Large = 14,
    Unit_Monster = 15,
    Unit_Monster_Blue = 16,
    Unit_Monster_Buff = 17,
    Unit_Monster_Camp = 18,
    Unit_Monster_Crab = 19, 
    Unit_Monster_Dragon = 20,
    Unit_Monster_Epic = 21,
    Unit_Monster_Gromp = 22,
    Unit_Monster_Krug = 23,
    Unit_Monster_Large = 24,
    Unit_Monster_Medium = 25,
    Unit_Monster_Raptor = 26,
    Unit_Monster_Red = 27,
    Unit_Monster_Wolf = 28,
    Unit_Plant = 29,
    Unit_Special = 30,
    Unit_Special_AzirR = 31,
    Unit_Special_AzirW = 32,
    Unit_Special_CorkiBomb = 33,
    Unit_Special_EpicMonsterIgnores = 34,
    Unit_Special_KPMinion = 35,
    Unit_Special_MonsterIgnores = 36,
    Unit_Special_Peaceful = 37,
    Unit_Special_SyndraSphere = 38,
    Unit_Special_TeleportTarget = 39,
    Unit_Special_Trap = 40,
    Unit_Special_Tunnel = 41,
    Unit_Special_TurretIgnores = 42,
    Unit_Special_UntargetableBySpells = 43,
    Unit_Special_Void = 44,
    Unit_Special_YorickW = 45,
    Unit_Structure = 46,
    Unit_Structure_Inhibitor = 47,
    Unit_Structure_Nexus = 48,
    Unit_Structure_Turret = 49,
    Unit_Structure_Turret_Inhib = 50,
    Unit_Structure_Turret_Inner = 51,
    Unit_Structure_Turret_Nexus = 52,
    Unit_Structure_Turret_Outer = 53,
    Unit_Structure_Turret_Shrine = 54,
    Unit_Ward = 55,
};


// thanks lview
class DDragonUnit {
    
    public static UNIT_DATA: any;
    public static readonly unitTags = new Map<string, UnitTag>([
        ["Unit_", UnitTag.Unit_],
        ["Unit_Champion", UnitTag.Unit_Champion],
        ["Unit_Champion_Clone", UnitTag.Unit_Champion_Clone],
        ["Unit_IsolationNonImpacting", UnitTag.Unit_IsolationNonImpacting],
        ["Unit_KingPoro", UnitTag.Unit_KingPoro],
        ["Unit_Minion", UnitTag.Unit_Minion],
        ["Unit_Minion_Lane", UnitTag.Unit_Minion_Lane],
        ["Unit_Minion_Lane_Melee", UnitTag.Unit_Minion_Lane_Melee],
        ["Unit_Minion_Lane_Ranged", UnitTag.Unit_Minion_Lane_Ranged],
        ["Unit_Minion_Lane_Siege", UnitTag.Unit_Minion_Lane_Siege],
        ["Unit_Minion_Lane_Super", UnitTag.Unit_Minion_Lane_Super],
        ["Unit_Minion_Summon", UnitTag.Unit_Minion_Summon],
        ["Unit_Minion_SummonName_game_character_displayname_ZyraSeed", UnitTag.Unit_Minion_SummonName_game_character_displayname_ZyraSeed],
        ["Unit_Minion_Summon_Large", UnitTag.Unit_Minion_Summon_Large],
        ["Unit_Monster", UnitTag.Unit_Monster],
        ["Unit_Monster_Blue", UnitTag.Unit_Monster_Blue],
        ["Unit_Monster_Buff", UnitTag.Unit_Monster_Buff],
        ["Unit_Monster_Camp", UnitTag.Unit_Monster_Camp],
        ["Unit_Monster_Crab", UnitTag.Unit_Monster_Crab],
        ["Unit_Monster_Dragon", UnitTag.Unit_Monster_Dragon],
        ["Unit_Monster_Epic", UnitTag.Unit_Monster_Epic],
        ["Unit_Monster_Gromp", UnitTag.Unit_Monster_Gromp],
        ["Unit_Monster_Krug", UnitTag.Unit_Monster_Krug],
        ["Unit_Monster_Large", UnitTag.Unit_Monster_Large],
        ["Unit_Monster_Medium", UnitTag.Unit_Monster_Medium],
        ["Unit_Monster_Raptor", UnitTag.Unit_Monster_Raptor],
        ["Unit_Monster_Red", UnitTag.Unit_Monster_Red],
        ["Unit_Monster_Wolf", UnitTag.Unit_Monster_Wolf],
        ["Unit_Plant", UnitTag.Unit_Plant],
        ["Unit_Special", UnitTag.Unit_Special],
        ["Unit_Special_AzirR", UnitTag.Unit_Special_AzirR],
        ["Unit_Special_AzirW", UnitTag.Unit_Special_AzirW],
        ["Unit_Special_CorkiBomb", UnitTag.Unit_Special_CorkiBomb],
        ["Unit_Special_EpicMonsterIgnores", UnitTag.Unit_Special_EpicMonsterIgnores],
        ["Unit_Special_KPMinion", UnitTag.Unit_Special_KPMinion],
        ["Unit_Special_MonsterIgnores", UnitTag.Unit_Special_MonsterIgnores],
        ["Unit_Special_Peaceful", UnitTag.Unit_Special_Peaceful],
        ["Unit_Special_SyndraSphere", UnitTag.Unit_Special_SyndraSphere],
        ["Unit_Special_TeleportTarget", UnitTag.Unit_Special_TeleportTarget],
        ["Unit_Special_Trap", UnitTag.Unit_Special_Trap],
        ["Unit_Special_Tunnel", UnitTag.Unit_Special_Tunnel],
        ["Unit_Special_TurretIgnores", UnitTag.Unit_Special_TurretIgnores],
        ["Unit_Special_UntargetableBySpells", UnitTag.Unit_Special_UntargetableBySpells],
        ["Unit_Special_Void", UnitTag.Unit_Special_Void],
        ["Unit_Special_YorickW", UnitTag.Unit_Special_YorickW],
        ["Unit_Structure", UnitTag.Unit_Structure],
        ["Unit_Structure_Inhibitor", UnitTag.Unit_Structure_Inhibitor],
        ["Unit_Structure_Nexus", UnitTag.Unit_Structure_Nexus],
        ["Unit_Structure_Turret", UnitTag.Unit_Structure_Turret],
        ["Unit_Structure_Turret_Inhib", UnitTag.Unit_Structure_Turret_Inhib],
        ["Unit_Structure_Turret_Inner", UnitTag.Unit_Structure_Turret_Inner],
        ["Unit_Structure_Turret_Nexus", UnitTag.Unit_Structure_Turret_Nexus],
        ["Unit_Structure_Turret_Outer", UnitTag.Unit_Structure_Turret_Outer],
        ["Unit_Structure_Turret_Shrine", UnitTag.Unit_Structure_Turret_Shrine],
        ["Unit_Ward", UnitTag.Unit_Ward],
    ]);

    private readonly data: any;

    public readonly name: string;
    public readonly healthBarHeight!: number;
    public readonly baseMoveSpeed!: number;
    public readonly baseAttackRange!: number;
    public readonly baseAttackSpeed!: number;
    public readonly attackSpeedRatio!: number;
    public readonly acquisitionRange!: number;
    public readonly selectionRadius!: number;
    public readonly pathingRadius!: number;
    public readonly gameplayRadius!: number;
    public readonly basicAtkMissileSpeed!: number;
    public readonly basicAtkWindup!: number;
    public readonly purchaseIdentities!: string[];
    public readonly tags: UnitTag[] = [];

    constructor(
        address: number
    ) {
        if(!DDragonUnit.UNIT_DATA) DDragonUnit.UNIT_DATA = JSON.parse(fs.readFileSync(`${process.env.APPDATA}/rank1/UnitData.json`, 'utf-8'));

        this.name = Memory.readMemory(
            Memory.readMemory(address + Offsets.ObjectName, memoryjs.DWORD),
            memoryjs.STRING
        );

        this.data = DDragonUnit.UNIT_DATA.find((x: any) => x.name === this.name.toLowerCase());

        if (this.data) {
            this.healthBarHeight = this.data.healthBarHeight;
            this.baseMoveSpeed = this.data.baseMoveSpeed;
            this.baseAttackRange = this.data.baseAttackRange;
            this.baseAttackSpeed = this.data.attackSpeed;
            this.attackSpeedRatio = this.data.attackSpeedRatio;
            this.acquisitionRange = this.data.acquisitionRange;
            this.selectionRadius = this.data.selectionRadius;
            this.pathingRadius = this.data.pathingRadius;
            this.gameplayRadius = this.data.gameplayRadius;
            this.basicAtkMissileSpeed = this.data.basicAtkMissileSpeed;
            this.basicAtkWindup = this.data.basicAtkWindup;
            this.purchaseIdentities = this.data.purchaseIdentities;
            this.tags = this.data.tags.map((x: string) => DDragonUnit.unitTags.get(x));
        }
    }

    public isMeele(): boolean {
        return this.data.purchaseIdentities.includes("Meele");
    }
}

export default DDragonUnit;