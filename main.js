// App controls the applications event lifecycle
// BrowserWindow creates and manages app windows
const { app, BrowserWindow} = require('electron')

// Wait for it...
// Creates a new window
// ... gasp
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height:600
    })
    win.loadFile('index.html')
}


// waits until the ready flag has fired
app.whenReady().then(() => {
    createWindow()

    // Apparently macOS apps keep running without any windows open
    // This allows us to open a new window when none are active
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
})

// Darwin is MacOs and window behaviour seems to be different
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

