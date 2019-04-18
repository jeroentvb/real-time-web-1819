function getTime (dateStr) {
  const date = new Date(dateStr)

  return `${date.getHours()}:${date.getMinutes()}`
}

function calcSail (weight, windspeed) {
  return (1.34 * weight) / windspeed
}

export const helper = {
  getTime,
  calcSail
}
