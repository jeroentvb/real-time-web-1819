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
  rolling: true,
  cookie: {
    maxAge: 2592000000
  }
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
  set: (socket, data) => {
    return new Promise(async (resolve, reject) => {
      data.spot = data.spot.toLowerCase()

      try {
        const result = await db.query('INSERT INTO sailPrediction.userData SET spot = ?, weight = ?', [
          data.spot,
          data.weight
        ])
        const userId = result.insertId

        socket.handshake.session.userdata = userId
        socket.handshake.session.save()

        console.log('Set a cookie with id' + userId)
        resolve(userId)
      } catch (err) {
        reject(err)
      }
    })
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
    spot = spot.toLowerCase()

    const userData = await db.query('SELECT * FROM sailPrediction.userData WHERE id = ?', socket.handshake.session.userdata)

    if (userData[0].spot) socket.leave(userData[0].spot)

    const spotData = await db.query('SELECT * FROM sailPrediction.spotData WHERE spot = ?', spot)

    if (spotData.length <= 0) {
      try {
        const data = await scrape.report(spot)
        const lastDataPoint = data.report[data.report.length - 1]

        socket.join(spot)

        io.in(spot).clients((err, clients) => {
          if (err) throw err
          if (clients.length === 1) timeout.start(spot)
        })

        socket.emit('data', lastDataPoint)

        await db.query('INSERT INTO sailPrediction.spotData SET spot = ?, windspeed = ?, winddirection = ?, time = ?', [
          data.spot,
          lastDataPoint.windspeed,
          lastDataPoint.winddirection,
          lastDataPoint.time
        ])
      } catch (err) {
        socket.emit('spotmessage', `The spot '${spot}' does not exist.`)
        console.error(err)
      }
    } else {
      socket.join(spot)
      socket.emit('data', spotData[0])
    }
  },
  update: async spot => {
    try {
      const data = await scrape.report(spot)
      const lastDataPoint = data.report[data.report.length - 1]

      io.to(spot).emit('data', lastDataPoint)

      await db.query('UPDATE sailPrediction.spotData SET windspeed = ?, winddirection = ?, time = ?', [
        lastDataPoint.windspeed,
        lastDataPoint.winddirection,
        lastDataPoint.time
      ])
    } catch (err) {
      console.error(err)
    }
  },
  restore: async socket => {
    try {
      const userData = await db.query('SELECT * FROM sailPrediction.userData WHERE id = ?', socket.handshake.session.userdata)
      const spot = userData[0].spot
      const spotData = await db.query('SELECT * FROM sailPrediction.spotData WHERE spot = ?', spot)

      const dataObj = {
        ...spotData[0],
        ...userData[0]
      }

      socket.join(spot)

      io.in(spot).clients((err, clients) => {
        if (err) throw err
        if (clients.length === 1) timeout.start(spot)
      })

      socket.emit('restore', dataObj)

      // if (new Date() - new Date(dataObj.time) > 600000) {
      //   let newSpotData = await scrape.report(spot)
      //   newSpotData = newSpotData.report[newSpotData.report.length - 1]
      //   const newDataObj = {
      //     ...newSpotData,
      //     ...userData[0]
      //   }
      //
      //   socket.emit('restore', newDataObj)
      // }
    } catch (err) {
      console.error(err)
    }
  },
  disconnect: async socket => {
    const userData = await db.query('SELECT * FROM sailPrediction.userData WHERE id = ?', socket.handshake.session.userdata)

    socket.leave(userData[0].spot)
  }
}

const timeout = {
  trigger: async spot => {
    console.log('Refreshing spot info!')

    data.update(spot)

    setTimeout(() => {
      timeout.trigger(spot)
    }, 600000)

    console.log(`Set a timeout for spot: ${spot}`)
  },
  start: spot => {
    console.log(`Set a timeout for spot: ${spot}`)
    this.timeout = setTimeout(() => {
      timeout.trigger(spot)
    }, 600000)
  },
  stop: () => {
    console.log('Timeout cleared!')
    clearTimeout(this.timeout)
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
      await cookie.set(socket, userData)

      data.send(socket, userData.spot)
    } else {
      data.send(socket, userData.spot)

      cookie.update(socket, userData)
    }
  })

  socket.on('disconnect', async () => {
    console.log('User disconnected')

    const userData = await db.query('SELECT * FROM sailPrediction.userData WHERE id = ?', socket.handshake.session.userdata)

    io.in(userData[0].spot).clients((err, clients) => {
      if (err) throw err
      if (clients.length === 0) timeout.stop()
    })
    // data.disconnect(socket)
  })
})
