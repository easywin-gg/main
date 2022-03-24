import Core from "./app/Core";
import Game from "./game/Game";
import { EventType } from "./events/EventBus";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

Core.getEventManager().subscribe(EventType.OnOpenLeague, async (script: Core) => {
    
    script.game = new Game(script);
    console.log(`League Process found, ${script.process.th32ProcessID}.`);
    
    const player = script.game.localPlayer;
    console.log(`Welcome ${player.getName()}`);

    while (true) {
      const now = new Date().getTime();
      script.game.readObjects();
      console.log('-------------------------------');
      console.clear();
      for (const object of script.game.others) {
          console.log(object.getName());
      }
  
      console.log(`Demorou ${new Date().getTime() - now}ms`);
      await new Promise((resolve)=> setTimeout(resolve, 10));
    }
});

Core.getEventManager().subscribe(EventType.OnCloseLeague, () => {
    console.log(`League closed.`);
})