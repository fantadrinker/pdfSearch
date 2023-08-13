// inits local database 
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const pdfDir = path.join(__dirname, '..', 'data');
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
  db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS ${TABLE_NAME} USING fts5(
    title,
    content
  )`, (err) => {
    if (err) {
      console.error('error creating virtual table', err.message);
    }
    console.log('Created virtual table');
  })
  /*
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created TEXT,
    updated TEXT
  )`);
  */
  // loads pdf from data folder
  fs.readdirSync(pdfDir).forEach(file => {
    pdfPath = path.join(pdfDir, file)
    // reads and prints out the pdf texts
    pdf(pdfPath).then(function(data) {
      console.log(`inserting ${file} into virtual table ${TABLE_NAME}`)
      db.run(`INSERT INTO ${TABLE_NAME}(title, content) VALUES (
        '${file}',
        '${data.text}'
      )`, (err) => {
        if (err) {
          console.error('error inserting into virtual table', err.message);
        }
        console.log('Inserted into virtual table');
      })
    })
  })
});

function getFiles(query) {
  return new Promise((resolve, reject) => {
    //const sql = `SELECT * FROM files ${query ? `WHERE content LIKE '%${query}%'` : ''};`;
    const sql = query? `SELECT title, snippet(${TABLE_NAME}, 1, '<b>', '</b>', '...', 10) AS matched_text FROM ${TABLE_NAME}('${query}')` 
      : `SELECT title FROM ${TABLE_NAME}`;
    console.log(query)
    console.log(`executing sql: ${sql}`)
    // TODO: prevent sql injection
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      console.log(222, rows)
      resolve(rows);
    });
  });
}

module.exports = {
  getFiles
}