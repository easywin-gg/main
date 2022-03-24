import Core from "../../app/Core";
import Offsets from "../offsets/Offsets";
import GameObject from "./GameObject";

class LocalPlayer extends GameObject {

    constructor(core: Core) {
        super(core, core.module.modBaseAddr + Offsets.LocalPlayer);
    } 

    getHoveredObject() {
        // TO DO
    }

}

export default LocalPlayer;