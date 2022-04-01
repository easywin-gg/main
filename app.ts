import CDN from "./cdn/CDN";
import memoryjs from "memoryjs";
import ObjectManager from "./core/manager/ObjectManager";
import Memory from "./core/memory/Memory";
import Game from "./core/game/Game";
import SDK from "./core/sdk/SDK";
import SDKLoader from "./core/sdk/SDKLoader";
import GameRenderer from "./core/renderer/GameRenderer";

class Rank1 {

    private readonly cdn: CDN;


    constructor() {
        this.cdn = new CDN();
    }

    async start() {
        console.log('       ______  ___   _   _  _   __  __  ');
        console.log('       | ___ \\/ _ \\ | \\ | || | / / /  | ');
        console.log('       | |_/ / /_\\ \\|  \\| || |/ /  `| | ');
        console.log('       |    /|  _  || . ` ||    \\   | | ');
        console.log('       | |\\ \\| | | || |\\  || |\\  \\ _| |_');
        console.log('       \\_| \\_\\_| |_/\\_| \\_/\\_| \\_/ \\___/');
        console.log('                                   ');

        console.log('[RANK1] Starting...');
        await this.cdn.start();

        const process = memoryjs.openProcess('League of Legends.exe');
        const module = memoryjs.findModule('League of Legends.exe', process.th32ProcessID);
        console.log('[RANK1] Module found: ' + module.modBaseAddr);

        Memory.process = process;
        Memory.module = module;

        Game.instance = new Game();
        const manager = new ObjectManager();
        manager.readObjectsFromMemory(Game.instance);


        const renderer = new GameRenderer();
        const sdk = new SDK(Game.instance, renderer);
        await SDKLoader.load(sdk);
        console.log('[RANK1] SDK and Core initialized');
        // const player = game.getLocalPlayer();
        // console.log('[RANK1] Local player:', player.name);

        setInterval(() => {
            manager.readObjectsFromMemory(Game.instance);
            manager.clearMissing(Game.instance);

            sdk.emit('tick');
            sdk.emit('draw');
        }, 3);


        // const enemies = game.getEnemyHeroes();
        // console.log('[RANK1] Enemies:', enemies.map(e => `${e.name} > ${e.health}`));

        // const sdk = new SDK(game);

        // while (true) {
        //     manager.readObjectsFromMemory(game);

        //     const heroes = game.getEnemyHeroes();
        //     const enemy = sdk.targetSelector.getLowestTarget(
        //         heroes
        //     )[0];

        //     let position;
        //     if (enemy) {
        //         console.log(enemy.name);
        //         position = sdk.renderer.worldToScreen(enemy.position);
        //     }

        //     sdk.orbwalker.orbwalk(position);
        //     await new Promise((resolve) => setTimeout(resolve, 10))
        // }

        // console.log(`Welcome ${player.getName()}`);
        // for (const [name, buff] of player.getBuffManager()) {
        //     console.log(`[BUFF] ${name} > Count: ${buff.count}, Expires At: ${buff.expiresAt}`)
        // }

        // for (const [slot, spell] of player.getSpellBook()) {
        //     console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
        // }

        // const position: Vector2 = {
        //     x: (sdk.renderer.width / 2) - 600,
        //     y: (sdk.renderer.height / 2) - 490
        // };

        // console.log('[RANK1] Started');
    }
}

const main = new Rank1();
main.start();   