// This is a complicated front end thing where we need to use commonJS which is a variant 
// of js that I haven't done much work with. Without this, it will not work. 

const { contextBridge, ipcRenderer } = require('electron');

// This exposes certain functions and variables to the renderer process
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // We can't communicate between the Dom and the main.js script, we need a messenger basically
    // This is the sender
    ping: () => ipcRenderer.invoke('ping')
});