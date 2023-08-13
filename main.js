const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const db = require('./lib/init.js')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadFile('dist/index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => {
    return 'pong'
  })
  ipcMain.handle('getFiles', async (event, ...args) => {
    const files = await db.getFiles(...args)
    return files
  })
  ipcMain.handle('selectDirectory', async () => {
    
    const result = await db.selectDirectory()
    return result
  })
  ipcMain.handle('loadFolder', async (event, ...args) => { 
    const result = await db.loadFolder(...args)
    return result
  })
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

