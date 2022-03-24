import Offsets from "./game/offsets/Offsets";
import memoryjs from 'memoryjs';
import { EventType } from "./events/eventbus";
import Core from "./app/Core";
import Game from "./game/Game";
import GameObject from "./game/objects/GameObject";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

const MAX_UNITS = 500;

Core.getEventManager().subscribe(EventType.OnOpenLeague, async(script: Core)=> {
    script.game = new Game(script);
    console.log(`League Process found, ${script.process.th32ProcessID}.`);
    
    const player = script.game.localPlayer;
    console.log(player.getPlayerName());
    
    // const objectManagerOffset = memoryjs.readMemory(
    //     script.process.handle,
    //     script.module.modBaseAddr + Offsets.ObjectManager, 
    //     memoryjs.INT
    //     );
        
    // if(objectManagerOffset <= 0) return;

    // const objectManager = memoryjs.readMemory(script.process.handle, core.module.modBaseAddr + Offsets.ObjectManager, memoryjs.DWORD);
    // const buffer = memoryjs.readBuffer(
    //     script.process.handle,
    //     objectManager,
    //     0x100
    // );

    // const numMissiles = memoryjs.readMemory(script.process.handle, objectManager + Offsets.MapCount, memoryjs.INT);
    // if(numMissiles <= 0) return false;
    // const rootNode = memoryjs.readMemory(script.process.handle, objectManager + Offsets.MapRoot, memoryjs.INT);
    // if (rootNode <= 0) return false;

    // console.log(objectManager);
    // console.log(numMissiles, rootNode);

    // const nodesToVisit: number[] = [];
	// const visitedNodes: number[] = [];
    
    // nodesToVisit.push(rootNode);
    
	// // // Read object pointers from tree
	// // var nrObj = 0;
	// // var reads = 0;
	// // var childNode1, childNode2, childNode3, node;
    // // while(reads < MAX_UNITS && nodesToVisit.length > 0) {
    // //     node = nodesToVisit.shift();
    // //     if(!node) continue;

    // //     reads++;
    // //     visitedNodes.push(node);
    // //     memoryjs.readBuffer(
    // //         script.process.handle,
    // //         node,
    // //         0x30
    // //     );

    // //     const xd = memoryjs.readMemory(script.process.handle, Offsets.MapNodeNetId, memoryjs.INT);
    // //     console.log(xd);
    // // }
    
    // // const objectManagerArray = memoryjs.readMemory(script.process.handle, Offsets.ObjectManager + 0x14, memoryjs.DWORD);

    // // const dwHeroList = memoryjs.readMemory(script.process.handle, core.module.modBaseAddr + Offsets.HeroList, memoryjs.DWORD);
    // // const heroArray = memoryjs.readMemory(script.process.handle, dwHeroList + 0x04, memoryjs.DWORD);
    // // console.log(heroArray);
    // // const HeroArrayLength: number = memoryjs.readMemory(script.process.handle, dwHeroList + 0x08, memoryjs.INT);
    // // console.log(HeroArrayLength);
    
    // // for (var i = 0; i < HeroArrayLength * 4; i += 4) {
    // //     console.log(memoryjs.readMemory(script.process.handle, heroArray + i, memoryjs.DWORD));

    // //     const object = new GameObject(
    // //         script, 
    // //         memoryjs.readMemory(script.process.handle, heroArray + i, memoryjs.DWORD)
    // //     );

    // //     //console.log(object.getHealth());
	// // }
});

Core.getEventManager().subscribe(EventType.OnCloseLeague, ()=> {
    console.log(`League closed.`);
})