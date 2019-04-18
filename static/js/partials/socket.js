/* global io */

import { update, restore } from '../script.js'

const socket = io()

socket.on('message', msg => {
  console.log(msg)
})

socket.on('restore', data => restore(data))

socket.on('data', data => {
  console.log(data)
  update(data)
})

function send (eventName, data) {
  socket.emit(eventName, data)
}

export const ws = {
  send
}
