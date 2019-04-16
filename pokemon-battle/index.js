const app = require('express')
const bodyParser = require('body-parser')

const helper = require('./partials/helper')
const Pokemon = require('./partials/pokemon')

require('dotenv').config()

let players = 0

let match = {
  players: [],
  reset: () => {
    match.players = []
    players = 0
    io.emit('end')
  }
}

const server = app()
  .set('view engine', 'ejs')
  .set('views', 'templates/pages')
  .use(app.static('static'))
  .use(bodyParser.urlencoded({
    extended: true
  }))

  .get('/', index)
  .get('/game', render)

  .use(notFound)
  .listen(process.env.PORT || 3000, () => console.log(`[server] listening on port ${process.env.PORT || 3000}`))

const io = require('socket.io')(server)

io.on('connection', socket => {
  socket.on('choose pokemon', pokemon => {
    if (match.players.length < 2) {
      players++
      socket.emit('player id', players)

      match.players.push({
        id: players,
        pokemon: new Pokemon(pokemon)
      })

      socket.emit('send pokemon', match.players[match.players.length - 1].pokemon)

      console.log(match.players)

      if (players === 2) io.emit('start match', match.players)
    }
  })

  socket.on('attack pokemon', attack => {
    match.players.forEach(player => {
      if (player.id !== attack.playerId) {
        player.pokemon.health -= helper.attackDamage(attack.damage)

        io.emit('update pokemon', {
          playerId: player.id,
          pokemon: player.pokemon,
          message: `${match.players[player.id === 2 ? 0 : 1].pokemon.name} used ${attack.name}!`
        })
      }
    })
  })

  socket.on('disconnect', () => {
    match.reset()
  })
})

function index (req, res) {
  res.render('index')
}

function render (req, res) {
  res.render('game')
}

function notFound (req, res) {
  res.status(404).render('error', {
    error: {
      status: 404,
      message: 'The page was not found.'
    }
  })
}
