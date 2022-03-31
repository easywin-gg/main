import Offsets from './offsets/Offsets';
import DDragonUnit, { UnitTag } from '../ddragon/DDragonUnit';
import Memory from '../memory/Memory';
import { Vector3 } from '../renderer/GameRenderer';
import { UnitType } from '../manager/ObjectManager';

class GameObject extends DDragonUnit {

    public id!: number;
    public networkId!: number;
    public team!: number;
    public position!: Vector3;
    public health!: number;
    public maxHealth!: number;
    public type!: UnitType;

    constructor(
        private readonly baseAddress: number
    ) {
        super(baseAddress);
    }

    public loadFromMemory(deepLoad = true, buffSize = 0x3600) {
        const data = Memory.readBuffer(this.baseAddress, buffSize);

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
        this.type = this.getUnitType();
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