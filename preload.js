const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping'),
  getFiles: (query) => ipcRenderer.invoke('getFiles', query),
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  openFileInFolder: (path) => ipcRenderer.invoke('openFileInFolder', path),
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// how to load pdfs here?