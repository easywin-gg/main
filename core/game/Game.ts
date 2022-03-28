import Core from "../Core";
import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";
import GameObject from "./GameObject";
import ObjectManager, { UnitType } from "./manager/ObjectManager";

class Game {

    public readonly objectManager: ObjectManager;
    public localPlayer: GameObject

    constructor(
        private readonly core: Core
    ) {
        const localPlayer = memoryjs.readMemory(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.LocalPlayer,
            memoryjs.INT
        ); 

        this.objectManager = new ObjectManager(this.core);
        this.localPlayer = new GameObject(this.core, localPlayer, UnitType.CHAMPIONS);
    }

    public getGameTime(): number {
        return memoryjs.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);;
    }

    public getEnemyHeroes(): GameObject[] {
        const heroes = this.objectManager.objects.get(UnitType.CHAMPIONS) || [];    
        console.log(heroes);
        return heroes.filter(o => o.getTeam() !== this.localPlayer.getTeam());
    }
}

export default Game;