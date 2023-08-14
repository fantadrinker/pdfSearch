// inits local database 
const { app, dialog } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const log = require('electron-log/main');

const TABLE_NAME = 'files_fts'

// before creating the database, check if the directory exists
// if it doesn't, create it
const dbDir = path.join(app.getPath('userData'), 'db')

if (!fs.existsSync(dbDir)) {
  log.info('creating db directory at', dbDir)
  fs.mkdirSync(dbDir)
}

const db = new sqlite3.Database(path.join(dbDir, 'notes.db'), (err) => {
  if (err) {
    log.info('Failed to connect to the notes database.')
    log.error(err.message);
    return
  }
  log.info('Connected to the notes database.');
} );

// creates table if it doesn't exist
db.serialize(() => {
  log.info('successfully serialized database')
});


function getFiles(query) {
  return new Promise((resolve, reject) => {
    //const sql = `SELECT * FROM files ${query ? `WHERE content LIKE '%${query}%'` : ''};`;
    const sql = query? `SELECT title, snippet(${TABLE_NAME}, 1, '<b>', '</b>', '...', 10) AS matched_text FROM ${TABLE_NAME}('${query}')` 
      : `SELECT title, content FROM ${TABLE_NAME}`;
    log.info(`executing sql: ${sql}`)
    // TODO: prevent sql injection
    db.all(sql, (err, rows) => {
      if (err) {
        log.info('Failed to get files from database.')
        log.error(err.message);
        reject(err);
      }
      resolve(rows);
    });
  });
}

async function selectDirectory() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  const pdfDir = result.filePaths[0]
  loadFolder(pdfDir)
  return pdfDir
}

function loadFolder(pdfDir) {
  // loads pdf from data folder
  // but first empty the table
  db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS ${TABLE_NAME} USING fts5(
    title,
    content
  )`, (err) => {
    if (err) {
      log.error('error creating virtual table', err.message);
    }
    db.run(`DELETE FROM ${TABLE_NAME}`, (err) => {
      if (err) {
        log.error('error deleting from virtual table', err.message);
      }
      log.info('Deleted from virtual table');
    })
    log.info('Created virtual table');
  })

  fs.readdirSync(pdfDir).forEach(file => {
    if (!file.endsWith('.pdf')) return

    pdfPath = path.join(pdfDir, file)
    // reads and prints out the pdf texts
    pdf(pdfPath).then(function(data) {
      log.info(`inserting ${file} into virtual table ${TABLE_NAME}`)
      const sanitizedText = data.text.replace(/'/g, '\'\'')
      db.run(`INSERT INTO ${TABLE_NAME}(title, content) VALUES (
        '${file}',
        '${sanitizedText}'
      )`, (err) => {
        if (err) {
          log.error('error inserting into virtual table', err.message);
        }
        log.info('Inserted into virtual table');
      })
    })
  }) 
}

module.exports = {
  getFiles,
  selectDirectory,
}