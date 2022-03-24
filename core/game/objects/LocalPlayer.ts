import Core from "../../app/Core";
import Offsets from "../offsets/Offsets";
import GameObject from "./GameObject";
import memoryjs from "memoryjs";

class LocalPlayer extends GameObject {

    constructor(core: Core) {
        const address = memoryjs.readMemory(core.process.handle, core.module.modBaseAddr + Offsets.LocalPlayer, memoryjs.INT);
        super(core, address);
    } 
}

export default LocalPlayer;