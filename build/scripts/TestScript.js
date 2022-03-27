"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("../core/app/Core"));
const EventBus_1 = require("../core/events/EventBus");
const Script_1 = __importDefault(require("../core/script/Script"));
class TestScript extends Script_1.default {
    constructor(core) {
        super({
            name: 'test',
            version: 1.0,
            author: 'Nospher'
        });
        this.core = core;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            Core_1.default.getEventManager().subscribe(EventBus_1.EventType.OnDraw, this.onDraw);
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onDraw() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = TestScript;
