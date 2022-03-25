import memoryjs, { Module, Process } from 'memoryjs';
import EventBus, { EventType } from '../events/EventBus';
import Game from '../game/Game';

type LeagueProcessConstructorArgs = {
    searchProcessIntervalSeconds: number;
}

class Core {

    private static eventBus: EventBus = new EventBus();

    private readonly args: LeagueProcessConstructorArgs;
    
    private searchingProcessInterval?: NodeJS.Timer;
    private open: boolean;
    
    public game!: Game;
    public process!: Process;
    public module!: Module;

    constructor({ searchProcessIntervalSeconds }: LeagueProcessConstructorArgs) {
        this.args = { searchProcessIntervalSeconds };
        this.open = false;
    }

    public start() {
        if(!this.searchingProcessInterval) {
            this.searchingProcessInterval = setInterval(()=> {
                try {
                    this.process = memoryjs.openProcess('League of Legends.exe');
                    if(this.process) {
                        this.module = memoryjs.findModule('League of Legends.exe', this.process.th32ProcessID);
                    } else if(this.open) {
                        console.log("CARALHO");
                        this.open = false;
                        Core.eventBus.publish(EventType.OnUnload, this);
                        return;
                    }
    
                    if(this.module && !this.open) {
                        this.open = true;
                        this.game = new Game(this);
                        Core.eventBus.publish(EventType.OnLoad, this);
                    }
                } catch {
    
                }
            }, this.args.searchProcessIntervalSeconds * 1000);
        }
    }

    public stop() {
        if(this.searchingProcessInterval) {
            this.searchingProcessInterval.unref();
        }
    }

    public static readIntegerFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset+4).readIntLE(0, 4);
    }

    public static readFloatFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset+4).readFloatLE(0);
    }

    public static getEventManager() {
        return Core.eventBus;
    }
}

export default Core;