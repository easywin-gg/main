import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";
import GameObject from "./GameObject";
import Memory from "../memory/Memory";
import ObjectManager from '../manager/ObjectManager';

class Game {

    public static instance: Game;

    private readonly localPlayer = new GameObject(
        Memory.readMemory(Memory.module.modBaseAddr + Offsets.LocalPlayer, memoryjs.INT)
    );

    public objects = new Map<number, GameObject>();
    public champions = new Set<GameObject>();
    public updatedThisFrame = new Set<number>();

    public getGameTime(): number {
        return Memory.readMemory(Memory.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);
    }

    public getLocalPlayer(): GameObject {
        this.localPlayer.loadFromMemory();
        return this.localPlayer;
    }

    public getHeroes(): GameObject[] {
        return Array.from(this.champions.values());
    }

    public getAllyHeroes(): GameObject[] {
        const heroes = this.getHeroes();
        const team = this.getLocalPlayer().team;

        return heroes.filter(o => o.team === team);
    }

    public getEnemyHeroes(): GameObject[] {
        const heroes = this.getHeroes();
        const team = this.getLocalPlayer().team;

        return heroes.filter(o => o.team !== team);
    }
}

export default Game;