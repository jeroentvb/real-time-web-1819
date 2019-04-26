function getTime (dateStr) {
  const d = new Date(dateStr)
  const h = `${d.getHours()}`.padStart(2, '0')
  const m = `${d.getMinutes()}`.padStart(2, '0')

  return `${h}:${m}`
}

function calcSail (weight, windspeed) {
  return (1.34 * weight) / windspeed
}

export const helper = {
  getTime,
  calcSail
}
