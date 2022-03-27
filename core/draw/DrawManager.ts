import { app, BrowserWindow } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import fs from 'fs';

app.disableHardwareAcceleration();
app.on('ready', () => {
  setTimeout(
    DrawManager.createOverlay,
    process.platform === 'linux' ? 1000 : 0
  )
})

class DrawManager {

  private static window: BrowserWindow;

  public start() {
    fs.writeFileSync(`${process.cwd()}/draw/draw.json`, JSON.stringify({
      arcs: {}
    }), 'utf-8');
    DrawManager.window.webContents.send('start');
  }

  public static createOverlay() {
    DrawManager.window = new BrowserWindow({
      width: 400,
      height: 300,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      ...overlayWindow.WINDOW_OPTS
    });

    DrawManager.window.loadURL(`${process.cwd()}/draw/draw.html`);
    DrawManager.window.webContents.openDevTools({ mode: 'detach', activate: false })
    DrawManager.window.setIgnoreMouseEvents(true);

    overlayWindow.attachTo(DrawManager.window, 'League of Legends (TM) Client');
  }
}

export default DrawManager;