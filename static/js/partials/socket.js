/* global io */

import { update, restore, showError } from '../script.js'

const socket = io()

socket.on('message', msg => {
  console.log(msg)
})

socket.on('restore', data => restore(data))

socket.on('data', data => {
  console.log(data)
  console.log('Received new data')
  update(data)
})

socket.on('spotmessage', msg => {
  showError(msg)
})

function send (eventName, data) {
  socket.emit(eventName, data)
}

export const ws = {
  send
}
