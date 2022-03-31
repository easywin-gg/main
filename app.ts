import CDN from "./cdn/CDN";
import memoryjs from "memoryjs";
import Core from "./core/Core";
import PluginManager from "./core/plugin/PluginManager";
import ObjectManager from "./core/manager/ObjectManager";

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

        const core = new Core(process, module);

        console.log('[RANK1] SDK and Core initialized');
        const player = core.game.getLocalPlayer();
        console.log('[RANK1] Local player:', player.name);

        const manager = new ObjectManager();
        manager.readObjectsFromMemory(core.game);

        const enemies = core.game.getEnemyHeroes();
        console.log('[RANK1] Enemies:', enemies.map(e => `${e.name} > ${e.health}`));

        // const pluginManager = new PluginManager(sdk);
        // await pluginManager.load();
        // const position = player.getPosition();
        // sdk.drawCircleWorld({
        //     key: 'circleAA',
        //     position: position,
        //     radius: player.getAttackRange() * 1.25,
        //     color: 'red',
        // })

        // if (enemies.length >= 1) {
        //     while (true) {

        //         await new Promise((resolve) => setTimeout(resolve, 1))
        //     }
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

        // while(true) {
        //     // const position = sdk.renderer.worldToScreen(player.getPosition());

        //     sdk.drawText({
        //         key: 'player',
        //         text: `vc me ama e consegue fazer gf e betar outras pessoas`,
        //         position,
        //         size: 50,
        //         color: 'blue',
        //     });

        //     await new Promise(resolve => setTimeout(resolve, 1000));
        // }
    }
}

const main = new Rank1();
main.start();   