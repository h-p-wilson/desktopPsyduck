const { contextBridge } = require('electron');

// This exposes certain functions and variables to the renderer process
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
});