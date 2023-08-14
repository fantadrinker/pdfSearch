const { shell } = require('electron')

function openFileInFolder(path) {
  shell.showItemInFolder(path)
}

function openFile(path) {
  console.log(111, path)
  shell.openPath(path)
}

module.exports = {
  openFileInFolder,
  openFile
}