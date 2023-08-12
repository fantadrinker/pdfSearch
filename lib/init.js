// inits local database 
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs');

const pdfDir = path.join(__dirname, '..', 'data');

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
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created TEXT,
    updated TEXT
  )`);

  // loads pdf from data folder
  fs.readdirSync(pdfDir).forEach(file => {
    pdfPath = path.join(pdfDir, file)
    // reads and prints out the pdf texts
    pdf(pdfPath).then(function(data) {
      db.run(`INSERT INTO files (title, content, created, updated) VALUES (
        '${file}',
        '${data.text}',
        '2021-01-01 00:00:00',
        '2021-01-01 00:00:00'
      )`);
    })
  })
  // then insert some dummy data into the table
  db.run(`INSERT INTO files (title, content, created, updated) VALUES (
    'test',
    'test content',
    '2021-01-01 00:00:00',
    '2021-01-01 00:00:00'
  )`);
});

function getFiles(query) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM files ${query ? `WHERE content LIKE '%${query}%'` : ''};`;
    console.log(query)
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

module.exports = {
  getFiles
}