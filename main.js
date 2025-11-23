// App controls the applications event lifecycle
// BrowserWindow creates and manages app windows
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Wait for it...
// Creates a new window
// ... gasp
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
          // This attaches the preload script to the renderer process
          preload: join(__dirname, 'preload.cjs'),
          nodeIntegration: false,
          contextIsolation: true
        }
    })
    win.loadFile('index.html')
}


// waits until the ready flag has fired
app.whenReady().then(() => {
  // this is the receiver
  ipcMain.handle('ping', () => 'pong')  
  createWindow()

    // Apparently macOS apps keep running without any windows open
    // This allows us to open a new window when none are active
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow()
        }
})
})

// Darwin is MacOs and window behaviour seems to be different
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

