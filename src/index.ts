import Offsets from "./game/offsets/Offsets";
import memoryjs from 'memoryjs';
import { EventType } from "./events/eventbus";
import Core from "./app/Core";
import Game from "./game/Game";
import GameObject from "./game/objects/GameObject";

const core = new Core({ searchProcessIntervalSeconds: 1 });
core.start();

const MAX_UNITS = 500;

const int_from_buffer = (data: Buffer, offset: number) => {
    return data.slice(offset, offset+4).readIntLE(0, 4);
}

Core.getEventManager().subscribe(EventType.OnOpenLeague, async (script: Core) => {
    script.game = new Game(script);
    console.log(`League Process found, ${script.process.th32ProcessID}.`);

    const player = script.game.localPlayer;
    console.log(player.getName());

    const objectManager = memoryjs.readMemory(
        script.process.handle,
        script.module.modBaseAddr + Offsets.ObjectManager,
        memoryjs.INT
    );

    if (objectManager <= 0) return;

    const rootNode: { address: any, next: any } = {
        address: memoryjs.readMemory(script.process.handle, objectManager + Offsets.MapRoot, memoryjs.INT),
        next: undefined
    };

    const addresses_seen: any[] = [];
    var current_node = rootNode;
    const pointers = []
    var count = 0

    while (current_node && count < MAX_UNITS) {
        if (addresses_seen.includes(current_node.address)) {
            current_node = current_node.next;
            continue;
        }

        addresses_seen.push(current_node.address)
        try {
            var data = memoryjs.readBuffer(script.process.handle, current_node.address, 0x18);
            count += 1;

            for (var i = 0; i < 3; i++) {
                var child_address = int_from_buffer(data, i * 4);
                if (addresses_seen.includes(child_address)) continue;

                current_node.next = { address: child_address, next: current_node.next }
            }

            const net_id = int_from_buffer(data, Offsets.MapNodeNetId);
            if (net_id - 0x40000000 <= 0x100000) {
                const pointer = int_from_buffer(data, Offsets.MapNodeObject);
                pointers.push(pointer)
            }
        } catch (error) {
            console.log(error)
        }

        current_node = current_node.next
    }

    for(const pointer of pointers) {
        const object = new GameObject(script, pointer);
        const name = object.getName();
        if(name.length <= 2 || !/^[ -~\t\n\r]+$/.test(name)) continue;

        console.log(name);
        // const data =  memoryjs.readBuffer(script.process.handle, pointer, 0x3400);
        // const name = memoryjs.readMemory(script.process.handle, int_from_buffer(data, Offsets.Name), memoryjs.STRING);
        // console.log(name);
    }

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

Core.getEventManager().subscribe(EventType.OnCloseLeague, () => {
    console.log(`League closed.`);
})