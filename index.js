const app = require('express')

const server = app()
  .set('view engine', 'ejs')
  .set('views', 'templates/pages')
  .use(app.static('static'))
  // .use(bodyParser.urlencoded({
  //   extended: true
  // }))

  .get('/', index)

  .use(notFound)
  .listen(process.env.PORT || 3000, () => console.log(`[server] listening on port ${process.env.PORT || 3000}`))

const io = require('socket.io')(server)

function index (req, res) {
  res.render('index')
}

io.on('connection', socket => {
  console.log('an user connected')

  socket.on('chat message', msg => {
    console.log('message: ' + msg)

    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

function notFound (req, res) {
  res.status(404).render('error', {
    error: {
      status: 404,
      message: 'The page was not found.'
    }
  })
}
