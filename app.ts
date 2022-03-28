import CDN from "./cdn/CDN";
import memoryjs from "memoryjs";
import Core from "./core/Core";
import SDK from "./core/sdk/SDK";

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

        const core = new Core(process, module);
        const player = core.game.localPlayer;

        console.log(player.getBaseAttackRange());

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