import DrawManager from "../draw/DrawManager";
import Game from "./Game";

import memoryjs from 'memoryjs';
import Core from "../app/Core";
import Offsets from "./offsets/Offsets";
import fs from "fs";

export type Vector2 = {
    x: number;
    y: number;
}

export type Vector3 = {
    x: number;
    y: number;
    z: number;
}

export type Vector4 = {
    x: number;
    y: number;
    z: number;
    w: number;
}

type DrawCircleArguments = {
    key: string,
    position: Vector2,
    radius: number, 
    startAngle: number, 
    endAngle: number, 
    antiClockwise: boolean,
    color: string
}

class GameRenderer {

    private width;
    private height;
    private viewProjMatrix: number[] = [];

    constructor(
        private readonly core: Core
    ) {
        // const data = memoryjs.readBuffer(
        //     this.core.process.handle,
        //     this.core.module.modBaseAddr + Offsets.Renderer,
        //     0x8
        // );

        // this.width = Core.readIntegerFromBuffer(data, Offsets.oRendererWidth);
        // this.height = Core.readIntegerFromBuffer(data, Offsets.oRendererHeight);

        this.width = 1920;
        this.height = 1080;

        const data = memoryjs.readBuffer(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.ViewProjMatrices,
            128
        );

        let viewMatrix: any[] = [];
        let projMatrix: any[] = [];
        for (var i = 0; i < 16; i++) {
            viewMatrix.push(Core.readFloatFromBuffer(data, i * 4));
        }

        for (var i = 0; i < 16; i++) {
            projMatrix.push(Core.readFloatFromBuffer(data, 64 + (i * 4)));
        }

        this.viewProjMatrix = this.multiplyMatrices(viewMatrix, projMatrix);
    }

    multiplyMatrices(a: number[], b: number[]) {
        let out = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0.;
                for (let k = 0; k < 4; k++)
                    sum = sum + a[i * 4 + k] * b[k * 4 + j];
                out[i * 4 + j] = sum;
            }
        }

        return out;
    }
    
    worldToScreen(pos: Vector3): Vector2 {
        let clipCoords: Vector4 = { x: 0, y: 0, z: 0, w: 0 };
        clipCoords.x = pos.x * this.viewProjMatrix[0] + pos.y * this.viewProjMatrix[4] + pos.z * this.viewProjMatrix[8] + this.viewProjMatrix[12];
        clipCoords.y = pos.x * this.viewProjMatrix[1] + pos.y * this.viewProjMatrix[5] + pos.z * this.viewProjMatrix[9] + this.viewProjMatrix[13];
        clipCoords.z = pos.x * this.viewProjMatrix[2] + pos.y * this.viewProjMatrix[6] + pos.z * this.viewProjMatrix[10] + this.viewProjMatrix[14];
        clipCoords.w = pos.x * this.viewProjMatrix[3] + pos.y * this.viewProjMatrix[7] + pos.z * this.viewProjMatrix[11] + this.viewProjMatrix[15];
        if (clipCoords.w < 1.0)
            clipCoords.w = 1.;

        let M: Vector2 = { x: 0, y: 0 };
        M.x = clipCoords.x / clipCoords.w;
        M.y = clipCoords.y / clipCoords.w;

        const x = (this.width / 2. * M.x) + (M.x + this.width / 2.);
        const y = -(this.height / 2. * M.y) + (M.y + this.height / 2.)

        return { x, y };
    }

    drawCircleAt(args: DrawCircleArguments) {
        const draw = JSON.parse(fs.readFileSync(`${process.cwd()}/draw/draw.json`, 'utf-8'));
        draw['arcs'][args.key] = args;
        fs.writeFileSync(`${process.cwd()}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }
}

export default GameRenderer;