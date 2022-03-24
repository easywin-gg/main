import Core from "./app/Core";
import Game from "./game/Game";
import { EventType } from "./events/EventBus";
import { SpellSlot } from "./game/GameObject";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

Core.getEventManager().subscribe(EventType.OnOpenLeague, async (script: Core) => {
    console.log(`League Process found, ${script.process.th32ProcessID}.`);

    const player = script.game.localPlayer;
    console.log(`Welcome ${player.getName()}`);
    script.game.readObjects();
    console.log('-------------------------------');

    for (const [slot, spell] of player.getSpellBook()) {
        console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
    }

    while (true) {
        console.clear();
        console.log(`${player.getName()} > HP: ${player.getHealth()}/${player.getMaxHealth()}`);
        for (const [slot, spell] of player.getSpellBook()) {
            console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
        }
    
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
});

Core.getEventManager().subscribe(EventType.OnCloseLeague, () => {
    console.log(`League closed.`);
})