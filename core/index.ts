import Core from "./app/Core";
import Game from "./game/Game";
import { EventType } from "./events/EventBus";
import { SpellSlot } from "./game/objects/GameObject";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

Core.getEventManager().subscribe(EventType.OnOpenLeague, async (script: Core) => {
    console.log(`League Process found, ${script.process.th32ProcessID}.`);
    
    const player = script.game.localPlayer;
    console.log(`Welcome ${player.name}`);
    script.game.readObjects();
    console.log('-------------------------------');

    for(const [slot, spell] of player.getSpellBook()) {
        console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
    }
    
    // while (true) {
    //   await new Promise((resolve)=> setTimeout(resolve, 10));
    // }
});

Core.getEventManager().subscribe(EventType.OnCloseLeague, () => {
    console.log(`League closed.`);
})