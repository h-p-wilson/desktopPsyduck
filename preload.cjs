const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('electronAPI', {
    setIgnoreMouseEvents: (ignore, options) => ipcRenderer.invoke('set-ignore-mouse-events', ignore, options),
    closeApp: () => ipcRenderer.invoke('close-app'),
    disableClickThrough: () => ipcRenderer.invoke('disable-click-through'),
    enableClickThrough: () => ipcRenderer.invoke('enable-click-through')
});