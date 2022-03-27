"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("../../app/Core"));
const memoryjs_1 = __importDefault(require("memoryjs"));
const Offsets_1 = __importDefault(require("../offsets/Offsets"));
class Buff {
    constructor(core, address) {
        this.core = core;
        this.address = address;
        const data = memoryjs_1.default.readBuffer(this.core.process.handle, address, Offsets_1.default.BuffSize);
        this.info = Core_1.default.readIntegerFromBuffer(data, Offsets_1.default.BuffInfo);
        this.name = memoryjs_1.default.readMemory(this.core.process.handle, this.info + Offsets_1.default.BuffInfoName, memoryjs_1.default.STRING);
        this.count = Core_1.default.readIntegerFromBuffer(data, Offsets_1.default.BuffCount);
        this.expiresAt = Core_1.default.readFloatFromBuffer(data, Offsets_1.default.BuffEndTime);
    }
    static loadBuffManager(core, buffEntryStart, buffEntryEnd) {
        const buffs = new Map();
        var currentAddress = buffEntryStart;
        while (currentAddress != buffEntryEnd) {
            const buffAddress = memoryjs_1.default.readMemory(core.process.handle, currentAddress, memoryjs_1.default.INT);
            try {
                const buff = new Buff(core, buffAddress);
                buffs.set(buff.name, buff);
            }
            catch (_a) { }
            ;
            currentAddress += 0x8;
        }
        return buffs;
    }
}
exports.default = Buff;
