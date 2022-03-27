import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";

class Buff {

    private info: number;

    public name: string;
    public count: number;
    public expiresAt: number;

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) {
        const data = memoryjs.readBuffer(
            this.core.process.handle,
            address,
            Offsets.BuffSize
        );

        this.info = Core.readIntegerFromBuffer(data, Offsets.BuffInfo);

        this.name = memoryjs.readMemory(this.core.process.handle, this.info + Offsets.BuffInfoName, memoryjs.STRING);
        this.count = Core.readIntegerFromBuffer(data, Offsets.BuffCount);
        this.expiresAt = Core.readFloatFromBuffer(data, Offsets.BuffEndTime);
    }

    public static loadBuffManager(core: Core, buffEntryStart: number, buffEntryEnd: number): Map<string, Buff> {
        const buffs = new Map<string, Buff>();

        var currentAddress = buffEntryStart;
        while (currentAddress != buffEntryEnd) {
            const buffAddress = memoryjs.readMemory(
                core.process.handle,
                currentAddress,
                memoryjs.INT
            );

            try {
                const buff = new Buff(core, buffAddress);
                buffs.set(buff.name, buff);
            } catch {};

            currentAddress += 0x8;
        }

        return buffs;
    }

}

export default Buff;