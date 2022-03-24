import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";

class GameObject {

    protected core: Core;
    protected address: number;

    constructor(core: Core, address: number) {
        this.core = core;
        this.address = memoryjs.readMemory(core.process.handle, address, memoryjs.INT);
    }

    getPlayerName() {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.PlayerName, memoryjs.STRING);
    }
    
    getMaxHealth() {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.MaxHealth, memoryjs.FLOAT);
    }
    
    getHealth() {
        return memoryjs.readMemory(this.core.process.handle, this.address + Offsets.Health, memoryjs.FLOAT);
    }


}       

export default GameObject;