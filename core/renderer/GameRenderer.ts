import memoryjs from 'memoryjs';
import Memory from '../memory/Memory';
import Offsets from "../offsets/Offsets";

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

class GameRenderer {

    public width;
    public height;

    constructor() {
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
        const data = Memory.readBuffer(
            Memory.module.modBaseAddr + Offsets.ViewProjMatrices,
            128
        );

        const viewMatrix: number[] = [];
        const projMatrix: number[] = [];
        for (var i = 0; i < 16; i++) {
            viewMatrix.push(Memory.readFloatFromBuffer(data, i * 4));
        }

        for (var i = 0; i < 16; i++) {
            projMatrix.push(Memory.readFloatFromBuffer(data, 64 + (i * 4)));
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
}

export default GameRenderer;