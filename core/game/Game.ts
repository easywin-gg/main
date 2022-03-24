import Core from "../app/Core";
import memoryjs from 'memoryjs';
import Offsets from "./offsets/Offsets";
import GameObject from "./GameObject";

const MAX_UNITS = 500;

class Game {

    public champions: GameObject[] = [];
    public minions: GameObject[] = [];
    public jungle: GameObject[] = [];
    public turrets: GameObject[] = [];
    public missiles: GameObject[] = [];
    public others: GameObject[] = [];

    public localPlayer: GameObject

    constructor(
        private readonly core: Core
    ) {
        const localPlayer = memoryjs.readMemory(
            this.core.process.handle, 
            this.core.module.modBaseAddr + Offsets.LocalPlayer, 
            memoryjs.INT
        );

        this.localPlayer = new GameObject(this.core, localPlayer);
    }

    getGameTime(): number {
        return memoryjs.readMemory(this.core.process.handle, this.core.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);;
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

        if (objectManager <= 0) return;

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
                    var child_address = Core.readIntegerFromBuffer(data, i * 4);
                    if (visitedAddress.includes(child_address)) continue;

                    currentNode.next = { address: child_address, next: currentNode.next }
                }

                const networkId = Core.readIntegerFromBuffer(data, Offsets.MapNodeNetId);
                if (networkId - 0x40000000 <= 0x100000) {
                    pointers.push(Core.readIntegerFromBuffer(data, Offsets.MapNodeObject))
                }
            } catch (error) {
                console.log(error)
            }

            currentNode = currentNode.next
        }

        pointers.forEach((pointer) => {
            try {
                const object = new GameObject(this.core, pointer);
                const name = object.getName();
                if (name.length <= 2 || !/^[ -~\t\n\r]+$/.test(name)) return;

                this.others.push(object);
            } catch (error) {

            }
        })
    }
}

export default Game;