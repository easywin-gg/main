import Memory from "../../memory/Memory";
import memoryjs from "memoryjs";
import Buff from "../Buff";
import GameObject from "../../GameObject";

class BuffManager {

    private buffs: Map<string, Buff>;

    constructor(
        private readonly object: GameObject,
        buffEntryStart: number,
        buffEntryEnd: number
    ) {
        this.buffs = this.loadBuffManager(buffEntryStart, buffEntryEnd);
    }

    public getBuff(name: string): Buff | undefined {
        const buff = this.buffs.get(name);
        return buff && buff.expiresAt > GameObject.getGameTime() ? buff : undefined;
    }

    public loadBuffManager(buffEntryStart: number, buffEntryEnd: number): Map<string, Buff> {
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

export default BuffManager;