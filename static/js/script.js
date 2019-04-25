import { ws } from './partials/socket.js'
import { helper } from './partials/helper.js'

const form = document.querySelector('form')
const spot = document.getElementById('spot')
const weight = document.getElementById('weight')
const loader = document.getElementById('loader')
const error = document.getElementById('error')

const info = document.getElementById('info')
const time = document.getElementById('time')
const windspeed = document.getElementById('windspeed')
const sailsize = document.getElementById('sailsize')

export function update (data) {
  error.classList.add('hidden')
  const recSail = helper.calcSail(weight.value, data.windspeed)

  time.textContent = helper.getTime(data.time)
  windspeed.textContent = data.windspeed
  sailsize.textContent = Math.round(recSail * 10) / 10

  if (info.classList.contains('hidden')) info.classList.remove('hidden')

  loader.textContent = ''
}

export function showError (msg) {
  loader.classList.add('hidden')
  info.classList.add('hidden')
  spot.value = ''

  error.textContent = msg
}

form.addEventListener('submit', e => {
  e.preventDefault()

  loader.classList.remove('hidden')

  if (weight.value && spot.value) {
    ws.send('spot', {
      spot: spot.value,
      weight: weight.value
    })
  }
})

export function restore (data) {
  console.log(data)

  weight.value = data.weight
  spot.value = data.spot

  info.classList.remove('hidden')
  loader.classList.add('hidden')

  const recSail = helper.calcSail(weight.value, data.windspeed)

  time.textContent = helper.getTime(data.time)
  windspeed.textContent = data.windspeed
  sailsize.textContent = Math.round(recSail * 10) / 10
}
