const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const pdf = require('pdf-parse')
const db = require('./lib/init.js')


function loadPDFs() {
  // loads pdf from data folder
  const pdfPath = path.join(__dirname, 'data', 'resume.pdf')
  // reads and prints out the pdf texts
  pdf(pdfPath).then(function(data) {
    console.log(data.text)
  })
}

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
  win.loadFile('index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => {
    return 'pong'
  })
  ipcMain.handle('getFiles', async () => {
    const files = await db.getFiles()
    return files
  })
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

