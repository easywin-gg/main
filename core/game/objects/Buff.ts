import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";
import Memory from "../../memory/Memory";

class Buff {

    public name: string;
    public count: number;
    public expiresAt: number;

    constructor(protected readonly address: number) {
        const data = Memory.readBuffer(
            address,
            Offsets.BuffSize
        );
        this.name = Memory.readMemory(
            Memory.readIntegerFromBuffer(data, Offsets.BuffInfo) + Offsets.BuffInfoName,
            memoryjs.STRING
        );

        this.count = Memory.readIntegerFromBuffer(data, Offsets.BuffCount);
        this.expiresAt = Memory.readFloatFromBuffer(data, Offsets.BuffEndTime);
    }

    public static loadBuffManager(buffEntryStart: number, buffEntryEnd: number): Map<string, Buff> {
        const buffs = new Map<string, Buff>();

        var currentAddress = buffEntryStart;
        while (currentAddress != buffEntryEnd) {
            const buffAddress = Memory.readMemory(
                currentAddress,
                memoryjs.INT
            );

            try {
                const buff = new Buff(buffAddress);
                buffs.set(buff.name, buff);
            } catch { };

            currentAddress += 0x8;
        }

        return buffs;
    }

}

export default Buff;