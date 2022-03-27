import { Module, Process } from 'memoryjs';
import DrawManager from './draw/DrawManager';
import Game from './game/Game';

class Core {

    public static readonly MAIN_FOLDER_PATH = `${process.env.APPDATA}/rank1`;

    public draw!: DrawManager;
    public game!: Game;

    public process: Process;
    public module: Module;

    constructor(process: Process, module: Module) {
        this.process = process;
        this.module = module;

        this.draw = new DrawManager();
        this.game = new Game(this);
    }

    public static readIntegerFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset+4).readIntLE(0, 4);
    }

    public static readFloatFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset+4).readFloatLE(0);
    }
}

export default Core;