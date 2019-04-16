/* global io */

import { render } from './partials/render.js'

const socket = io()
const form = document.getElementById('select-pokemon')
const inputs = document.getElementsByClassName('select-pokemon')
let player = {}

form.addEventListener('submit', e => {
  e.preventDefault()

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      socket.emit('choose pokemon', inputs[i].value)
      player.pokemon = inputs[i].value

      render.waitingMessage(form, inputs[i].value)
    }
  }
})

socket.on('start match', players => {
  console.log('I want to be the very best!')

  players.forEach(opponent => {
    if (opponent.id !== player.id) {
      render.game(opponent, player)

      let buttons = document.getElementsByClassName('button--attack')
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', e => {
          socket.emit('attack pokemon', {
            playerId: player.id,
            damage: buttons[i].dataset.damage,
            name: buttons[i].dataset.name
          })

          for (let j = 0; j < buttons.length; j++) {
            buttons[j].disabled = true
          }
        })
      }
    }
  })
})

socket.on('player id', id => {
  player.id = id
  console.log(`Player id: ${player.id}`)
})

socket.on('send pokemon', pokemon => {
  player.pokemon = pokemon
  console.log(player.pokemon)
})

socket.on('update pokemon', data => {
  if (data.playerId === player.id) {
    let pokemon = document.querySelector('.section--player .pokemon--player')
    pokemon.classList.add('damage')
    setTimeout(() => {
      pokemon.classList.remove('damage')
    }, 1000)

    let healthBar = document.querySelector('.section--player .hp-bar--amount')
    healthBar.style.width = `${data.pokemon.health}%`

    let buttons = document.getElementsByClassName('button--attack')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false
    }
  } else {
    let pokemon = document.querySelector('.section--opponent .pokemon--opponent')
    pokemon.classList.add('damage')
    setTimeout(() => {
      pokemon.classList.remove('damage')
    }, 1000)

    let healthBar = document.querySelector('.section--opponent .hp-bar--amount')
    healthBar.style.width = `${data.pokemon.health}%`
  }

  console.log(data.message)
})

socket.on('end', () => {
  window.location.reload()
})
