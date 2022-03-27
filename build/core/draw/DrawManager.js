"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_overlay_window_1 = require("electron-overlay-window");
const fs_1 = __importDefault(require("fs"));
electron_1.app.disableHardwareAcceleration();
electron_1.app.on('ready', () => {
    setTimeout(DrawManager.createOverlay, process.platform === 'linux' ? 1000 : 0);
});
class DrawManager {
    start() {
        fs_1.default.writeFileSync(`${process.cwd()}/draw/draw.json`, JSON.stringify({
            arcs: {}
        }), 'utf-8');
        DrawManager.window.webContents.send('start');
    }
    static createOverlay() {
        DrawManager.window = new electron_1.BrowserWindow(Object.assign({ width: 400, height: 300, webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            } }, electron_overlay_window_1.overlayWindow.WINDOW_OPTS));
        DrawManager.window.loadURL(`${process.cwd()}/draw/draw.html`);
        DrawManager.window.webContents.openDevTools({ mode: 'detach', activate: false });
        DrawManager.window.setIgnoreMouseEvents(true);
        electron_overlay_window_1.overlayWindow.attachTo(DrawManager.window, 'League of Legends (TM) Client');
    }
}
exports.default = DrawManager;
