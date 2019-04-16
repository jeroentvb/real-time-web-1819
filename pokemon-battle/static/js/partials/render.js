import { element } from './element.js'

function game (opponent, player) {
  const main = document.getElementById('main')
  main.classList.add('game')
  document.body.classList.add('game-container')

  console.log(opponent, player)

  const section1 = section(player, 'player')

  const section2 = section(opponent, 'opponent')

  const section3 = element.create('section', 'section--text')
  const h2 = element.heading('h2', '')

  section3.appendChild(h2)

  const section4 = element.create('section', 'section--menu')
  // const h3 = element.heading('h3', 'Player 1 begins.')
  const div = element.create('div', 'attack-buttons')

  player.pokemon.attacks.forEach((attack, i) => {
    const button = element.create('button', 'button--attack')
    const h3 = element.heading('h3', attack.name)
    const p = element.paragraph(`${attack.damage} damage`)

    element.appendChildren(button, [
      h3,
      p
    ])

    button.dataset.damage = attack.damage
    button.dataset.name = attack.name
    button.setAttribute('name', 'attack')
    if (player.id !== 1) button.disabled = true

    div.appendChild(button)
  })

  element.appendChildren(section4, [
    // h3,
    div
  ])

  element.update(main, [
    section1,
    section2,
    section3,
    section4
  ])
}

function section (player, type) {
  const section = element.create('section', `section--${type}`)
  const div = element.create('div', 'pokemon-info')
  const h = element.heading('h2', player.pokemon.name)
  const div2 = element.create('div', 'hp-bar')
  const div3 = element.create('div', 'hp-bar--amount')
  div3.style.width = `${player.pokemon.health}%`
  div2.appendChild(div3)

  element.appendChildren(div, [
    h,
    div2
  ])

  const img = element.img(`/img/${player.pokemon.name}.png`, ['pokemon', `pokemon--${type}`])
  const ground = element.img('/img/ground.png', ['pokemon--ground', `pokemon--${type}--ground`])

  element.appendChildren(section, [
    div,
    img,
    ground
  ])

  return section
}

function waitingMessage (form, pokemon) {
  const main = document.getElementById('main')

  const div = element.create('div', 'chosen-pokemon')
  const img = element.img(`/img/${pokemon}.png`)
  const h2 = element.heading('h2', `${pokemon}, I choose you!`)
  const p = element.paragraph('Waiting for another player...')

  element.appendChildren(div, [
    img,
    h2,
    p
  ])

  form.remove()

  main.appendChild(div)
}

export const render = {
  game,
  waitingMessage
}
