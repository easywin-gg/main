import memoryjs, { Module, Process } from 'memoryjs';
import { EventEmitter } from 'events';

type LeagueProcessConstructorArgs = {
    searchProcessIntervalSeconds: number;
}

class LeagueProcess extends EventEmitter {

    private readonly args: LeagueProcessConstructorArgs;
    private searchingProcessInterval?: NodeJS.Timer;
    private open: boolean;
    
    public process!: Process;
    public module!: Module;

    constructor({ searchProcessIntervalSeconds }: LeagueProcessConstructorArgs) {
        super();

        this.args = { searchProcessIntervalSeconds };
        this.open = false;
    }

    startSearchProcess() {
        if(!this.searchingProcessInterval) {
            this.searchingProcessInterval = this.searchProcess();
        }
    }

    stopSearchProcess() {
        if(this.searchingProcessInterval) {
            this.searchingProcessInterval.unref();
        }
    }

    private searchProcess(): NodeJS.Timer {
        return setInterval(()=> {
            try {
                this.process = memoryjs.openProcess('League of Legends.exe');
                if(this.process) {
                    this.module = memoryjs.findModule('League of Legends.exe', this.process.th32ProcessID);
                }

                if(this.module && !this.open) {
                    this.open = true;
                    this.emit("load", this);
                }

                if(this.open && !this.module) {
                    this.open = false;
                    this.emit("unload");
                }
            } catch {

            }
        }, this.args.searchProcessIntervalSeconds);
    }
}

export default LeagueProcess;