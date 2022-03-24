import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";

class GameObject {

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) { }

    getName(): string {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.Name, memoryjs.STRING);
    }

    getHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.Health, memoryjs.FLOAT);
    }

    getMaxHealth(): number {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.MaxHealth, memoryjs.FLOAT);
    }

}

export default GameObject;