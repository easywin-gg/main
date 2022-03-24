import Core from "../app/Core";
import GameObject from "./objects/GameObject";
import LocalPlayer from "./objects/LocalPlayer";
import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";
import memory from "memoryjs";

class Game {

    private readonly core: Core;

    public champions: GameObject[] = [];
    public minions: GameObject[] = [];
    public jungle: GameObject[] = [];
    public turrets: GameObject[] = [];
    public missiles: GameObject[] = [];
    public others: GameObject[] = [];

    public localPlayer: LocalPlayer
    public gameTime: number = 0.0;

    constructor(core: Core) {
        this.core = core;

        this.localPlayer = new LocalPlayer(this.core);
        this.gameTime = memoryjs.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);
    }

}

export default Game;