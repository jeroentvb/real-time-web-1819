const server = require('../index')
const io = require('socket.io')(server)

io.on('connection', socket => {
  socket.emit('message', 'you connected!')

  socket.on('event', e => {

  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})
