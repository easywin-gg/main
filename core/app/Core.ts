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
                    }
    
                    if(this.module && !this.open) {
                        this.open = true;
                        Core.eventBus.publish(EventType.OnOpenLeague, this);
                    }
    
                    if(this.open && !this.module) {
                        this.open = false;
                        Core.eventBus.publish(EventType.OnCloseLeague, this);
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

    public static getEventManager() {
        return Core.eventBus;
    }
}

export default Core;