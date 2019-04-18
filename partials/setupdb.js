const mysql = require('mysql')
require('dotenv').config()

var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

db.connect(err => {
  if (err) throw err
  console.log('[MySql] connection established..')
})

function createDb () {
  return new Promise((resolve, reject) => {
    db.query('CREATE DATABASE IF NOT EXISTS sailPrediction', (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log('[MySql] Database created')
        resolve()
      }
    })
  })
}

function createTable (query, tableName) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        console.log(`[MySql] ${tableName} table created`)
        resolve()
      }
    })
  })
}

const queries = {
  userData: `CREATE TABLE IF NOT EXISTS sailPrediction.userData(id int NOT NULL AUTO_INCREMENT, spot VARCHAR(255), weight INT, PRIMARY KEY (id))`,
  spotData: `CREATE TABLE IF NOT EXISTS sailPrediction.spotData(id int NOT NULL AUTO_INCREMENT, spot VARCHAR(255), windspeed INT, winddirection INT, time VARCHAR(255), PRIMARY KEY(id))`
}

Promise.all([
  createDb(),
  createTable(queries.userData, 'userData'),
  createTable(queries.spotData, 'spotData')
])
  .then(() => {
    console.log('[MySql] Database set up succesfully')
    db.end()
  })
  .catch(err => {
    console.error(err)
    db.query('DROP DATABASE sailPrediction', (error, result) => {
      if (error) {
        console.log('Database could not be reset')
        throw error
      } else {
        console.log('Database was reset because of the following error:')
        throw err
      }
    })
  })
