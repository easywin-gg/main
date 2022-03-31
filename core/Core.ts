import { Module, Process } from 'memoryjs';
import Game from './game/Game';
import fs from 'fs';
import Memory from './memory/Memory';

class Core {

    public static readonly MAIN_FOLDER_PATH = `${process.env.APPDATA}/rank1`;
    public game!: Game;

    constructor(process: Process, module: Module) {
        Memory.process = process;
        Memory.module = module;

        this.game = new Game();

        if (!fs.existsSync(`${Core.MAIN_FOLDER_PATH}/scripts`)) {
            fs.mkdirSync(`${Core.MAIN_FOLDER_PATH}/scripts`);
        }
    }
}

export default Core;