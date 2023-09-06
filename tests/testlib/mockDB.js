const fs = require('fs')
const path = require('path')
const log = require('electron-log/main')
const sqlite3 = require('sqlite3').verbose();

const TABLE_NAME = 'files_fts'

const dbDir = './testdb'

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
});

db.serialize(() => {
  log.info('successfully serialized database')
});

// test utilities

function mockDataSetup(mockData) {
  return new Promise((resolve, reject) => {

    db.run(`DROP TABLE IF EXISTS ${TABLE_NAME}`, (err) => {
      if (err) {
        log.error('error dropping virtual table', err.message);
        reject(err)
      }
      log.info('Dropped virtual table');
      db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS ${TABLE_NAME} USING fts5(
        title,
        content,
        path
      )`, (err) => {
        if (err) {
          log.error('error creating virtual table', err.message);
          reject(error)
        }
        log.info('Created virtual table');
        mockData.forEach((data) => {
          const sanitizedText = data.content.replace(/'/g, '\'\'')
          db.run(`INSERT INTO ${TABLE_NAME}(title, content, path) VALUES (
            '${data.title}',
            '${sanitizedText}',
            '${data.id}'
          )`, (err) => {
            if (err) {
              log.error(`error inserting ${data.title} into virtual table`, err.message);
              reject(err)
            }
            log.info(`Inserted ${data.title} into virtual table`);
            resolve()
          })
        })
      })
    })
  })
}

module.exports = {
  mockDataSetup
}