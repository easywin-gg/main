import GameObject from "../GameObject";
import Memory from "../memory/Memory";
import Offsets from "../offsets/Offsets";

export const SpellSlot = {
    Q: 0,
    W: 1,
    E: 2,
    R: 3,
    D: 4,
    F: 5
}

class Spell {

    public level: number;
    public expiresAt: number;

    constructor(protected readonly address: number) {
        const data = Memory.readBuffer(
            address,
            Offsets.SpellSlotSize
        );

        this.level = Memory.readIntegerFromBuffer(data, Offsets.SpellSlotLevel);
        this.expiresAt = Memory.readFloatFromBuffer(data, Offsets.SpellSlotCooldownExpire);
    }

    getCooldown(): number {
        const cooldown = this.expiresAt - GameObject.getGameTime();
        return cooldown > 0 ? cooldown : 0;
    }

    isReady(): boolean {
        return this.getCooldown() === 0;
    }

}

export default Spell;