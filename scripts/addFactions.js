import mongoose from 'mongoose';
import bootstrap from './bootstrap';

bootstrap();

var Faction = mongoose.model('Faction');

Faction.create([
  {name: 'NEUTRAL'},
  {name: 'ORDER'},
  {name: 'CHAOS'},
], (err, factions) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  process.exit();
});
