/* global io */

import { helper } from './helper.js'

(() => {
  const socket = io()
  const form = document.getElementById('form')
  const m = document.getElementById('m')
  const messages = document.getElementById('messages')

  form.addEventListener('submit', e => {
    e.preventDefault()
    if (m.value !== '') {
      socket.emit('chat message', m.value)
      m.value = ''
    }

    return false
  })

  socket.on('chat message', msg => {
    msg = helper.formatText(msg, '<')
    msg = helper.formatText(msg, '*')
    msg = helper.formatText(msg, '_')
    msg = helper.formatText(msg, '-')

    console.log(msg)

    const li = document.createElement('li')
    messages.appendChild(li)
    li.innerHTML = msg
  })

  socket.on('command background', color => {
    document.body.style.backgroundColor = color
  })
})()
