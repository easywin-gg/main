"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoryjs_1 = __importDefault(require("memoryjs"));
const Core_1 = __importDefault(require("../app/Core"));
const Offsets_1 = __importDefault(require("./offsets/Offsets"));
const fs_1 = __importDefault(require("fs"));
class GameRenderer {
    constructor(core) {
        // const data = memoryjs.readBuffer(
        //     this.core.process.handle,
        //     this.core.module.modBaseAddr + Offsets.Renderer,
        //     0x8
        // );
        this.core = core;
        this.viewProjMatrix = [];
        // this.width = Core.readIntegerFromBuffer(data, Offsets.oRendererWidth);
        // this.height = Core.readIntegerFromBuffer(data, Offsets.oRendererHeight);
        this.width = 1920;
        this.height = 1080;
        const data = memoryjs_1.default.readBuffer(this.core.process.handle, this.core.module.modBaseAddr + Offsets_1.default.ViewProjMatrices, 128);
        let viewMatrix = [];
        let projMatrix = [];
        for (var i = 0; i < 16; i++) {
            viewMatrix.push(Core_1.default.readFloatFromBuffer(data, i * 4));
        }
        for (var i = 0; i < 16; i++) {
            projMatrix.push(Core_1.default.readFloatFromBuffer(data, 64 + (i * 4)));
        }
        this.viewProjMatrix = this.multiplyMatrices(viewMatrix, projMatrix);
    }
    multiplyMatrices(a, b) {
        let out = [];
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
    worldToScreen(pos) {
        let clipCoords = { x: 0, y: 0, z: 0, w: 0 };
        clipCoords.x = pos.x * this.viewProjMatrix[0] + pos.y * this.viewProjMatrix[4] + pos.z * this.viewProjMatrix[8] + this.viewProjMatrix[12];
        clipCoords.y = pos.x * this.viewProjMatrix[1] + pos.y * this.viewProjMatrix[5] + pos.z * this.viewProjMatrix[9] + this.viewProjMatrix[13];
        clipCoords.z = pos.x * this.viewProjMatrix[2] + pos.y * this.viewProjMatrix[6] + pos.z * this.viewProjMatrix[10] + this.viewProjMatrix[14];
        clipCoords.w = pos.x * this.viewProjMatrix[3] + pos.y * this.viewProjMatrix[7] + pos.z * this.viewProjMatrix[11] + this.viewProjMatrix[15];
        if (clipCoords.w < 1.0)
            clipCoords.w = 1.;
        let M = { x: 0, y: 0 };
        M.x = clipCoords.x / clipCoords.w;
        M.y = clipCoords.y / clipCoords.w;
        const x = (this.width / 2. * M.x) + (M.x + this.width / 2.);
        const y = -(this.height / 2. * M.y) + (M.y + this.height / 2.);
        return { x, y };
    }
    drawCircleAt(args) {
        const draw = JSON.parse(fs_1.default.readFileSync(`${process.cwd()}/draw/draw.json`, 'utf-8'));
        draw['arcs'][args.key] = args;
        fs_1.default.writeFileSync(`${process.cwd()}/draw/draw.json`, JSON.stringify(draw), 'utf-8');
    }
}
exports.default = GameRenderer;
