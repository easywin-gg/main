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

}

export default Buff;