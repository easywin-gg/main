import DrawManager from "../../draw/DrawManager";
import Game from "../Game";

import memoryjs from 'memoryjs';
import Core from "../../app/Core";
import Offsets from "../offsets/Offsets";
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
    }

    worldToScreen(position: Vector3): Vector2 {
        const data = memoryjs.readBuffer(
            this.core.process.handle,
            this.core.module.modBaseAddr + Offsets.ViewProjMatrices,
            128
        );

        const viewMatrix: number[] = [];
        const projMatrix: number[] = [];
        for (var i = 0; i < 16; i++) {
            viewMatrix.push(Core.readFloatFromBuffer(data, i * 4));
        }

        for (var i = 0; i < 16; i++) {
            projMatrix.push(Core.readFloatFromBuffer(data, 64 + (i * 4)));
        }

        const viewProjMatrix = this.multiplyMatrices(viewMatrix, projMatrix);

        const clipCoords: Vector4 = {
            x: position.x * viewProjMatrix[0] + position.y * viewProjMatrix[4] + position.z * viewProjMatrix[8] + viewProjMatrix[12],
            y: position.x * viewProjMatrix[1] + position.y * viewProjMatrix[5] + position.z * viewProjMatrix[9] + viewProjMatrix[13],
            z: position.x * viewProjMatrix[2] + position.y * viewProjMatrix[6] + position.z * viewProjMatrix[10] + viewProjMatrix[14],
            w: position.x * viewProjMatrix[3] + position.y * viewProjMatrix[7] + position.z * viewProjMatrix[11] + viewProjMatrix[15]
        };

        if (clipCoords.w < 1.0) clipCoords.w = 1.;

        const vec2: Vector2 = {
            x: clipCoords.x / clipCoords.w,
            y: clipCoords.y / clipCoords.w
        };

        return {
            x: (this.width / 2. * vec2.x) + (vec2.x + this.width / 2.),
            y: -(this.height / 2. * vec2.y) + (vec2.y + this.height / 2.)
        };
    }

    private multiplyMatrices(a: number[], b: number[]) {
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

    drawCircleAt(args: DrawCircleArguments) {
        const draw = JSON.parse(fs.readFileSync(`${process.cwd()}/draw/draw.json`, 'utf-8'));
        draw['arcs'][args.key] = args;
        fs.writeFileSync(`${process.cwd()}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }
}

export default GameRenderer;