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
})
