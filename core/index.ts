import Core from "./app/Core";
import Game from "./game/Game";
import { EventType } from "./events/EventBus";
import DrawManager from "./draw/DrawManager";
import GameRenderer from "./game/GameRenderer";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

Core.getEventManager().subscribe(EventType.OnLoad, async (script: Core) => {
    console.log(`League Process found, ${script.process.th32ProcessID}.`);
    const player = script.game.localPlayer;
    console.log(`Welcome ${player.getName()}`);

    console.log('HAHAHAH');
    script.game.readObjects();
    console.log('-------------------------------');
 
    for (const [name, buff] of player.getBuffManager()) {
        console.log(`[BUFF] ${name} > Count: ${buff.count}, Expires At: ${buff.expiresAt}`)
    }

    for (const [slot, spell] of player.getSpellBook()) {
        console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
    }

    script.draw.start();
    
    setInterval(()=> {
        const position = script.game.localPlayer.getPosition();
        const renderer = script.game.getGameRenderer();
        const positionToScreen = renderer.worldToScreen(position);
        
        renderer.drawCircleAt({
            key: 'aa',
            position: positionToScreen,
            radius: 700/2,
            startAngle: 0,
            endAngle: Math.PI*2,
            antiClockwise: false,
            color: 'red',
        });
    }, 1);

    // script.draw.render('arc', {
    //     x: 879.962338043385, 
    //     y: 504.39186332041413, 
    //     radius: 700/2, 
    //     startAngle: 0,
    //     endAngle: Math.PI*2, 
    //     antiCloclwise: false,
    //     color: 'blue' 
    // });

    // while (true) {
    //     console.clear();
    //     console.log(`${player.getName()} > HP: ${player.getHealth()}/${player.getMaxHealth()}`);
    //     for (const [slot, spell] of player.getSpellBook()) {
    //         console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
    //     }
    
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    // }
});

Core.getEventManager().subscribe(EventType.OnUnload, () => {
    console.log(`League closed.`);
})