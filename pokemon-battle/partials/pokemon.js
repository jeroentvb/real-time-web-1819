module.exports = class Pokemon {
  constructor (pokemon) {
    switch (pokemon) {
      case 'empoleon':
        this.name = 'Empoleon'
        this.health = 100
        this.attacks = [
          {
            name: 'Hydro Pump',
            damage: 20
          },
          {
            name: 'Drill Peck',
            damage: 18
          },
          {
            name: 'Bubble Beam',
            damage: 14
          },
          {
            name: 'Metal Claw',
            damage: 8
          }
        ]
        this.pp = 80
        break
      case 'infernape':
        this.name = 'Infernape'
        this.health = 100
        this.attacks = [
          {
            name: 'Flare Blitz',
            damage: 20
          },
          {
            name: 'Fire Spin',
            damage: 18
          },
          {
            name: 'Flame Wheel',
            damage: 14
          },
          {
            name: 'Ember',
            damage: 8
          }
        ]
        this.pp = 80
        break
      case 'torterra':
        this.name = 'Torterra'
        this.health = 100
        this.attacks = [
          {
            name: 'Leaf Storm',
            damage: 20
          },
          {
            name: 'Giga Drain',
            damage: 18
          },
          {
            name: 'Razor Leaf',
            damage: 14
          },
          {
            name: 'Absorb',
            damage: 8
          }
        ]
        this.pp = 80
        break
      case 'luxray':
        this.name = 'Luxray'
        this.health = 100
        this.attacks = [
          {
            name: 'Wild Charge',
            damage: 20
          },
          {
            name: 'Discharge',
            damage: 18
          },
          {
            name: 'Thunder Fang',
            damage: 14
          },
          {
            name: 'Spark',
            damage: 8
          }
        ]
        this.pp = 80
        break
      default:
        console.error('No pokemon name..')
    }
  }
}
