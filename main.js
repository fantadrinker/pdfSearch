const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const db = require('./lib/init.js')
const log = require('electron-log/main')

const isDev = process.argv.includes('--dev')

function createWindow() {
  log.info('creating window')
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // and load the index.html of the app.
  if (isDev) {
    const url = `http://localhost:${process.env.PORT || 8080}`
    log.info('development environment detected, loading dev server at ' + url)
    win.loadURL(url)
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

app.whenReady().then(() => {
  log.info('app ready, setting up ipc handlers')
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

}).catch((err) => {
  log.info('app failed to start')
  log.error(err)
})

app.on('window-all-closed', () => {
  log.info('window-all-closed')
  if (process.platform !== 'darwin') app.quit()
})

