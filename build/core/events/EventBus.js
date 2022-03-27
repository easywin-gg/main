"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType[EventType["OnLoad"] = 0] = "OnLoad";
    EventType[EventType["OnUnload"] = 1] = "OnUnload";
    EventType[EventType["OnTick"] = 2] = "OnTick";
    EventType[EventType["OnDraw"] = 3] = "OnDraw";
})(EventType = exports.EventType || (exports.EventType = {}));
class EventBus {
    constructor() {
        this.subscriptions = new Map();
    }
    subscribe(eventType, callback) {
        var _a;
        if (this.subscriptions.has(eventType)) {
            (_a = this.subscriptions.get(eventType)) === null || _a === void 0 ? void 0 : _a.push(callback);
            return;
        }
        this.subscriptions.set(eventType, [callback]);
    }
    publish(eventType, args) {
        var _a;
        if (!this.subscriptions.has(eventType))
            return;
        (_a = this.subscriptions.get(eventType)) === null || _a === void 0 ? void 0 : _a.forEach(callback => callback(args));
    }
}
exports.default = EventBus;
