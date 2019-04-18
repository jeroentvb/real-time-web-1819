const app = require('express')
const scrape = require('wind-scrape') // This is my own package https://github.com/jeroentvb/wind-scrape
const sharedsession = require('express-socket.io-session')
const expressSession = require('express-session')

const db = require('./partials/db')

require('dotenv').config()

const MySQLStore = require('express-mysql-session')(expressSession)
const session = expressSession({
  store: new MySQLStore(db.config),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  rolling: true
})

db.init()

const server = app()
  .set('view engine', 'ejs')
  .set('views', 'templates/pages')
  .use(app.static('static'))
  .use(session)

  .get('/', index)

  .use(notFound)
  .listen(process.env.PORT || 3000, () => console.log(`[server] listening on port ${process.env.PORT || 3000}`))

const io = require('socket.io')(server)

io.use(sharedsession(session, {
  autoSave: true
}))

async function index (req, res) {
  res.render('index')
}

function notFound (req, res) {
  res.status(404).render('error', {
    error: {
      status: 404,
      message: 'The page was not found.'
    }
  })
}

const cookie = {
  set: async (socket, data) => {
    try {
      const result = await db.query('INSERT INTO sailPrediction.userData SET spot = ?, weight = ?', [
        data.spot,
        data.weight
      ])
      const userId = result.insertId

      socket.handshake.session.userdata = userId
      socket.handshake.session.save()

      console.log('Set a cookie with id' + userId)
    } catch (err) {
      console.error(err)
    }
  },
  update: async (socket, data) => {
    const userId = socket.handshake.session.userdata

    try {
      await db.query('UPDATE sailPrediction.userData SET spot = ?, weight = ? WHERE id = ?', [
        data.spot,
        data.weight,
        userId
      ])

      console.log('Updated spot for user' + userId)
    } catch (err) {
      console.error(err)
    }
  }
}

const data = {
  send: async (socket, spot) => {
    const result = await db.query('SELECT * FROM sailPrediction.spotData WHERE spot = ?', spot)

    if (result.length <= 0) {
      try {
        const data = await scrape.report(spot)
        const lastDataPoint = data.report[data.report.length - 1]

        socket.emit('data', lastDataPoint)

        await db.query('INSERT INTO sailPrediction.spotData SET spot = ?, windspeed = ?, winddirection = ?, time = ?', [
          data.spot,
          lastDataPoint.windspeed,
          lastDataPoint.winddirection,
          lastDataPoint.time
        ])
      } catch (err) {
        console.error(err)
      }
    } else {
      socket.emit('data', result[0])
    }
  },
  restore: async socket => {
    try {
      const userData = await db.query('SELECT * FROM sailPrediction.userData WHERE id = ?', socket.handshake.session.userdata)
      const spotData = await db.query('SELECT * FROM sailPrediction.spotData WHERE spot = ?', userData[0].spot)

      const data = {
        ...spotData[0],
        ...userData[0]
      }

      socket.emit('restore', data)
    } catch (err) {
      console.error(err)
    }
  }
}

io.on('connection', socket => {
  console.log('User connected')

  socket.emit('message', 'you connected!')

  if (socket.handshake.session.userdata) {
    data.restore(socket)
  }

  socket.on('spot', async userData => {
    if (!socket.handshake.session.userdata) {
      cookie.set(socket, userData)

      data.send(socket, userData.spot)
    } else {
      cookie.update(socket, userData)

      data.send(socket, userData.spot)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})
