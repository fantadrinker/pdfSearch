// inits local database 
const { app, dialog } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');
const log = require('electron-log/main');

const TABLE_NAME = 'files_fts'

const MAX_DEPTH = 5

const isTest = process.argv.includes('--test')

log.info(`initializing database, ${process.argv.reduce((acc, arg) => {
  return acc + ', ' + arg
}, '')}}`)

// before creating the database, check if the directory exists
// if it doesn't, create it
const dbDir = isTest? './testdb': path.join(app.getPath('userData'), 'db')

if (!fs.existsSync(dbDir)) {
  log.info('creating db directory at', dbDir)
  fs.mkdirSync(dbDir)
}

if (!app) {
  log.info(`running in test mode, data directory ${dbDir}`)
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
  log.info('getting files from database')
  return new Promise((resolve, reject) => {
    const sql = query? `SELECT path, title, snippet(${TABLE_NAME}, 1, '<b>', '</b>', '...', 10) AS matched_text FROM ${TABLE_NAME}('${query}')` 
      : `SELECT path, title, content FROM ${TABLE_NAME} LIMIT 10`;
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
  if (pdfDir) {
    loadFolder(pdfDir)
  }
  return pdfDir
}

async function extractText(filePath) {
  try {
    const ext = path.extname(filePath)
    switch (ext) {
      case '.pdf':
        const data = await pdf(filePath)
        return data.text
      case '.txt':
        // this should be easy
        break;
      case '.docx':
        const result = await mammoth.extractRawText({path: filePath})
        return result.value
        break;
      default:
        log.info('skipping file', filename)
    }
  } catch (err) {
    log.error('error extracting text', err.message)
  }
  return ''
}

function loadFolder(pdfDir) {
  // loads pdf from data folder
  // but first empty the table
  db.run(`DROP TABLE IF EXISTS ${TABLE_NAME}`, (err) => {
    if (err) {
      log.error('error dropping virtual table', err.message);
      return
    }
    log.info('Dropped virtual table');
  })
  db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS ${TABLE_NAME} USING fts5(
    title,
    content,
    path
  )`, (err) => {
    if (err) {
      log.error('error creating virtual table', err.message);
    }
    log.info('Created virtual table');
  })
  const dirs = [{
    path: pdfDir,
    depth: 0
  }] // mutable const array

  while (dirs.length > 0) {
    const dir = dirs.pop()
    log.info('reading dir', dir)
    fs.readdirSync(dir.path, {
      withFileTypes: true
    }).forEach(async file => {
      if (file.isDirectory()) {
        if (dir.depth < MAX_DEPTH) {
          dirs.push({
            path: path.join(dir.path, file.name),
            depth: dir.depth + 1
          })
        }
      } else {
        const pdfPath = path.join(dir.path, file.name)
        const relFilename = path.relative(pdfDir, pdfPath)
        const rawTxt = await extractText(pdfPath)
        if (!rawTxt) {
          return
        }

        log.info(`inserting ${relFilename} into virtual table ${TABLE_NAME}`) 
        const sanitizedText = rawTxt.replace(/'/g, '\'\'')
        db.run(`INSERT INTO ${TABLE_NAME}(title, content, path) VALUES (
          '${relFilename}',
          '${sanitizedText}',
          '${pdfPath}'
        )`, (err) => {
          if (err) {
            log.error(`error inserting ${relFilename} into virtual table`, err.message);
          }
          log.info(`Inserted ${relFilename} into virtual table`);
        })
      }
    })
  }
}


module.exports = {
  getFiles,
  selectDirectory,
}