import Core from "../app/Core";
import GameObject from "./objects/GameObject";
import LocalPlayer from "./objects/LocalPlayer";
import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";

const MAX_UNITS = 500;
const int_from_buffer = (data: Buffer, offset: number) => {
    return data.slice(offset, offset+4).readIntLE(0, 4);
}

class Game {

    private readonly core: Core;

    public champions: GameObject[] = [];
    public minions: GameObject[] = [];
    public jungle: GameObject[] = [];
    public turrets: GameObject[] = [];
    public missiles: GameObject[] = [];
    public others: GameObject[] = [];

    public localPlayer: LocalPlayer
    public gameTime: number = 0.0;

    constructor(core: Core) {
        this.core = core;

        this.localPlayer = new LocalPlayer(this.core);
        this.gameTime = memoryjs.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);
    }

    readObjects() {
        this.champions = [];
        this.minions = [];
        this.jungle = [];
        this.turrets = [];
        this.missiles = [];
        this.others = [];

        const objectManager = memoryjs.readMemory(
            this.core.process.handle, 
            this.core.module.modBaseAddr + Offsets.ObjectManager, 
            memoryjs.INT
        );

        if(objectManager <= 0) return;
        
        const mapRoot = memoryjs.readMemory(this.core.process.handle, objectManager + Offsets.MapRoot, memoryjs.INT);
        const visitedAddress: number[] = [];
        const pointers: number[] = [];
        
        var unitsRead = 0;
        var currentNode: { address: number, next: any } = {
            address: mapRoot,
            next: undefined
        };

        while (currentNode && unitsRead < MAX_UNITS) {
            if (visitedAddress.includes(currentNode.address)) {
                currentNode = currentNode.next;
                continue;
            }
    
            visitedAddress.push(currentNode.address);

            try {
                const data = memoryjs.readBuffer(this.core.process.handle, currentNode.address, 0x18);
                unitsRead += 1;
    
                for (var i = 0; i < 3; i++) {
                    var child_address = int_from_buffer(data, i * 4);
                    if (visitedAddress.includes(child_address)) continue;
    
                    currentNode.next = { address: child_address, next: currentNode.next }
                }
    
                const networkId = int_from_buffer(data, Offsets.MapNodeNetId);
                if (networkId - 0x40000000 <= 0x100000) pointers.push(int_from_buffer(data, Offsets.MapNodeObject))
            } catch (error) {
                console.log(error)
            }
    
            currentNode = currentNode.next
        }

        for(const pointer of pointers) {
            const object = new GameObject(this.core, pointer);
            this.others.push(object);
        }
    }
}

export default Game;