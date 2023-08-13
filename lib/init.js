// inits local database 
const { dialog } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const TABLE_NAME = 'files_fts'

// todo: import pdf parse module, parse pdfs from data directory, then add 
//       parsed pdfs to database

const db = new sqlite3.Database('./db/notes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the notes database.');
} );

// creates table if it doesn't exist
db.serialize(() => {
  console.log('successfully serialized database')
});


function getFiles(query) {
  return new Promise((resolve, reject) => {
    //const sql = `SELECT * FROM files ${query ? `WHERE content LIKE '%${query}%'` : ''};`;
    const sql = query? `SELECT title, snippet(${TABLE_NAME}, 1, '<b>', '</b>', '...', 10) AS matched_text FROM ${TABLE_NAME}('${query}')` 
      : `SELECT title, content FROM ${TABLE_NAME}`;
    console.log(`executing sql: ${sql}`)
    // TODO: prevent sql injection
    db.all(sql, (err, rows) => {
      if (err) {
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
}

function loadFolder(pdfDir) {
  // loads pdf from data folder
  // but first empty the table
  db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS ${TABLE_NAME} USING fts5(
    title,
    content
  )`, (err) => {
    if (err) {
      console.error('error creating virtual table', err.message);
    }
    db.run(`DELETE FROM ${TABLE_NAME}`, (err) => {
      if (err) {
        console.error('error deleting from virtual table', err.message);
      }
      console.log('Deleted from virtual table');
    })
    console.log('Created virtual table');
  })

  fs.readdirSync(pdfDir).forEach(file => {
    if (!file.endsWith('.pdf')) return

    pdfPath = path.join(pdfDir, file)
    // reads and prints out the pdf texts
    pdf(pdfPath).then(function(data) {
      console.log(`inserting ${file} into virtual table ${TABLE_NAME}`)
      const sanitizedText = data.text.replace(/'/g, '\'\'')
      db.run(`INSERT INTO ${TABLE_NAME}(title, content) VALUES (
        '${file}',
        '${sanitizedText}'
      )`, (err) => {
        if (err) {
          console.error('error inserting into virtual table', err.message);
        }
        console.log('Inserted into virtual table');
      })
    })
  }) 
}

module.exports = {
  getFiles,
  selectDirectory,
}