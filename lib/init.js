// inits local database 
const sqlite3 = require('sqlite3').verbose();
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'data', 'resume.pdf');

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
  pdf(pdfPath).then(function(data) {
    console.log(data.text)
  })
  db.run(`CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created TEXT,
    updated TEXT
  )`);

  // then insert some dummy data into the table
  db.run(`INSERT INTO files (title, content, created, updated) VALUES (
    'test',
    'test content',
    '2021-01-01 00:00:00',
    '2021-01-01 00:00:00'
  )`);
});

function getFiles() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM files', (err, rows) => {
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