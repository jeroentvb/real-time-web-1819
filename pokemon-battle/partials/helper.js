function attackDamage (damage) {
  return parseInt(damage) + (Math.floor(Math.random() * 10) + 1)
}

module.exports = {
  attackDamage
}
