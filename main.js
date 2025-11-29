import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize
    
    const win = new BrowserWindow({
        width: screenWidth,
        height: screenHeight,
        x: 0,
        y: 0,
        transparent: true,
        frame: false,
        hasShadow: false,
        skipTaskbar: true,
        webPreferences: {
          preload: join(__dirname, 'preload.cjs'),
          nodeIntegration: false,
          contextIsolation: true
        }
    })
    
    win.setIgnoreMouseEvents(true, { forward: true })
    win.setAlwaysOnTop(true)
    win.setVisibleOnAllWorkspaces(true)
    
    win.loadFile('index.html')
    
    return win;
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  
  let mainWindow;
  
  const createWindowWithRef = () => {
    mainWindow = createWindow();
    return mainWindow;
  };
  
  ipcMain.handle('set-ignore-mouse-events', (event, ignore, options) => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(ignore, options);
    }
  });
  
  ipcMain.handle('disable-click-through', () => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(false);
    }
  });
  
  ipcMain.handle('enable-click-through', () => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    }
  });
  
  ipcMain.handle('close-app', () => {
    app.quit();
  });
  
  createWindowWithRef()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
