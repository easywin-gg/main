import { app, BrowserWindow } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import Core from '../Core';

app.disableHardwareAcceleration();
app.on('ready', () => {
  setTimeout(
    DrawManager.createOverlay,
    process.platform === 'linux' ? 1000 : 0
  )
})

class DrawManager {

  private static window: BrowserWindow;

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

    DrawManager.window.loadURL(`${Core.MAIN_FOLDER_PATH}/draw/index.html`);
    DrawManager.window.webContents.openDevTools({ mode: 'detach', activate: false })
    DrawManager.window.setIgnoreMouseEvents(true);
    DrawManager.window.webContents.send('draw', Core.MAIN_FOLDER_PATH);

    overlayWindow.attachTo(DrawManager.window, 'League of Legends (TM) Client');
  }
}

export default DrawManager;