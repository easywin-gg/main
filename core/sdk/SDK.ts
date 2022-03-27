import Core from "../Core";
import Game from "../game/Game";
import GameRenderer, { Vector2 } from "../game/renderer/GameRenderer";
import EventManager from "./event/EventManager";
import fs from 'fs'

type DrawCircleArguments = {
    key: string,
    position: Vector2,
    radius: number,
    startAngle: number,
    endAngle: number,
    antiClockwise: boolean,
    color: string,
    fill: boolean
}

// make type DrawRectangleArguments
type DrawRectangleArguments = {
    key: string,
    position: Vector2,
    width: number,
    height: number,
    color: string,
    fill: boolean
}

// make type DrawTextArguments
type DrawTextArguments = {
    key: string,
    position: Vector2,
    text: string,
    size: number,
    color: string,
}

class SDK { 

    public readonly game: Game;
    public readonly renderer: GameRenderer;
    public readonly eventManager: EventManager;

    constructor(
        private readonly core: Core
    ) {
        this.game = core.game;
        this.renderer = new GameRenderer(this.core);
        this.eventManager = new EventManager();
    }


    drawCircle(args: DrawCircleArguments) {
        const draw = JSON.parse(fs.readFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, 'utf-8'));
        draw['arcs'][args.key] = args;
        fs.writeFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }

    drawRectangle(args: DrawRectangleArguments) {
        const draw = JSON.parse(fs.readFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, 'utf-8'));
        draw['rectangles'][args.key] = args;
        fs.writeFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }

    drawText(args: DrawTextArguments) {
        const draw = JSON.parse(fs.readFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, 'utf-8'));
        draw['texts'][args.key] = args;
        fs.writeFileSync(`${Core.MAIN_FOLDER_PATH}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }

}

export default SDK;