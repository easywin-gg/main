import Core from "../../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "../offsets/Offsets";

class Spell {

    public level: number;
    public expiresAt: number;

    constructor(
        protected readonly core: Core,
        protected readonly address: number
    ) {
        const data = memoryjs.readBuffer(
            this.core.process.handle,
            address,
            Offsets.SpellSlotSize
        );

        this.level = Core.readIntegerFromBuffer(data, Offsets.SpellSlotLevel);
        this.expiresAt = Core.readFloatFromBuffer(data, Offsets.SpellSlotCooldownExpire);
    }

}

export default Spell;