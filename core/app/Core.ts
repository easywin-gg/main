import memoryjs, { Module, Process } from 'memoryjs';
import DrawManager from '../draw/DrawManager';
import LeagueEventManager, { EventType } from '../events/LeagueEvent';
import Game from '../game/Game';

type LeagueProcessConstructorArgs = {
    searchProcessIntervalSeconds: number;
}

class Core {

    private static eventBus: LeagueEventManager = new LeagueEventManager();

    private readonly args: LeagueProcessConstructorArgs;
    
    private searchingProcessInterval?: NodeJS.Timer;
    private open: boolean;
    
    public draw!: DrawManager;
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
                    }
    
                    if(this.module && !this.open) {
                        this.open = true;
                        this.draw = new DrawManager();
                        this.game = new Game(this);
                        Core.eventBus.publish(EventType.OnOpen, this);
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