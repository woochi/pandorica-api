class Faction {
  constructor(type, name, description) {
    this.name = name;
    this.description = description;
    this.points = 0;
  }
}

export const ORDER = 'ORDER';
export const NEUTRAL = 'NEUTRAL';
export const CHAOS = 'CHAOS';

export const factions = {
  [ORDER]: new Faction('Order'),
  [NEUTRAL]: new Faction('Neutral'),
  [CHAOS]: new Faction('Chaos')
};

export default Faction;
