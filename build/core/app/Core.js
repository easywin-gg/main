"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoryjs_1 = __importDefault(require("memoryjs"));
const DrawManager_1 = __importDefault(require("../draw/DrawManager"));
const EventBus_1 = __importStar(require("../events/EventBus"));
const Game_1 = __importDefault(require("../game/Game"));
class Core {
    constructor({ searchProcessIntervalSeconds }) {
        this.args = { searchProcessIntervalSeconds };
        this.open = false;
    }
    start() {
        if (!this.searchingProcessInterval) {
            this.searchingProcessInterval = setInterval(() => {
                try {
                    this.process = memoryjs_1.default.openProcess('League of Legends.exe');
                    if (this.process) {
                        this.module = memoryjs_1.default.findModule('League of Legends.exe', this.process.th32ProcessID);
                    }
                    if (this.module && !this.open) {
                        this.open = true;
                        this.draw = new DrawManager_1.default();
                        this.game = new Game_1.default(this);
                        Core.eventBus.publish(EventBus_1.EventType.OnLoad, this);
                    }
                }
                catch (_a) {
                }
            }, this.args.searchProcessIntervalSeconds * 1000);
        }
    }
    stop() {
        if (this.searchingProcessInterval) {
            this.searchingProcessInterval.unref();
        }
    }
    static readIntegerFromBuffer(buffer, offset) {
        return buffer.slice(offset, offset + 4).readIntLE(0, 4);
    }
    static readFloatFromBuffer(buffer, offset) {
        return buffer.slice(offset, offset + 4).readFloatLE(0);
    }
    static getEventManager() {
        return Core.eventBus;
    }
}
Core.eventBus = new EventBus_1.default();
exports.default = Core;
