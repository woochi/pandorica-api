var mongo = require('mongodb');
var mongoose = require('mongoose');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
import {generateCode} from '../src/models/fields/code';
import bootstrap from './bootstrap';

bootstrap();

var initialTasks = []
  .concat(Array(75).fill().map(() => { return {points: 100}; }))
  .concat(Array(70).fill().map(() => { return {points: 150}; }))
  .concat(Array(26).fill().map(() => { return {points: 170}; }))
  .concat(Array(17).fill().map(() => { return {points: 180}; }))
  .concat(Array(15).fill().map(() => { return {points: 250}; })) // Nörttitytöt, kokemuspiste
  .concat(Array(2).fill().map(() => { return {points: 300}; })) // KPS, Skenukisa
  .map((task) => {
    return _.extend({}, task, {code: generateCode()});
  });

var neutralQuests = [
  {
    title: 'Candy to the Cloackroom',
    description: 'Offer refreshments (or candy) to the hard workers at the Cloackroom (Narikka).',
    points: 200
  },
  {
    title: 'Secret of the Iron',
    description: 'Find out about the mysteries of Iron from the smiths.',
    points: 200
  },
  {
    title: 'Opening Ceremony',
    description: 'Attend the Ropecon opening ceremony.',
    points: 200
  },
  {
    title: 'The Gala',
    description: 'Attend the Ropecon Gala.',
    points: 300
  },
  {
    title: 'A Visit to the Nerd Girls',
    description: 'Visit the Nerd Girls (Nörttitytöt) booth and ask for the latest rumours.',
    points: 100
  },
  {
    title: 'New Experiences',
    description: 'Visit the Experience Point (Kokemuspiste) and ask for more quests.',
    points: 100
  },
  {
    title: '"Kivellä kiinnostaa"',
    description: 'Find out what wisdom the almighty Kivi (Stone) has to offer.',
    points: 180
  },
  {
    title: 'Knowledge on Wheels',
    description: 'Visit the Helmet\'s tube-on-wheels of knowledge.',
    points: 250
  },
  {
    title: 'Open Mic',
    description: 'Enlighten the day of a Troubleshooter (TS) by telling a classy joke.',
    points: 200
  },
  {
    title: 'Cleanliness is Godly',
    description: 'Cleanse the Realms of Ropecon by picking up one plastic bag full of trashes. Claim your reward at the Info-desk.',
    points: 500
  },
  {
    title: 'A Night\'s Rest',
    description: 'A warrior knows the importance of rest. Sleep in the sleeping area.',
    points: 150
  },
  {
    title: 'Strategic Maneuvers',
    description: 'Learning strategy is essential for a good warrior. Board games are a good way to learn it. Borrow a board game from the board game desk.',
    points: 200
  }
]
.map((quest) => {
  return _.extend({}, quest, {faction: 'NEUTRAL'});
});

const orderQuests = [
  {
    title: 'True Colours of Order',
    description: 'Declare yourself to be part of the Guardians of Order by painting Order-related art on your skin and showing it at the Larp-desk.'
  },
  {
    title: 'Badge of Order',
    description: 'Show where you stand by obtaining or creating an Order badge for yourself. Claim your reward at the Larp desk.'
  },
  {
    title: 'Guild Moment: Order',
    description: 'Immortalize a moment by taking a photo of yourself with someone dressed as a hero and sharing it on Instagram with the hashtag #RoRorder. Report then to the Larp-desk.'
  },
  {
    title: 'In Orderly Form',
    description: 'Form the word ORDER with 4 of your friends by using only your bodies/props. Then take a picture of the deed and post it on Instagram using hashtag #RoRorder. Claim your reward at the Larp-desk.'
  },
  {
    title: 'Bardly Endeavours',
    description: 'Praise the Order by writing a orderly poem. You may share it with the hashtag #RoRorder. Show your work and claim your reward at the Larp-desk.'
  },
  {
    title: 'A Guest of Honour',
    description: 'Pay your respect for one of the honorable Guests of Honor and take a picture with him. You may share it with the hashtag #RoRorder and/or #ropecon.'
  },
  {
    title: 'Order: Boss Fight!',
    description: 'It is time for the final showdown. An unholy champion of Chaos has spawned in the Hall 5\'s boffer area. Defeat the champion in a boffer match (or cheer others on) and let the Order rule Ropecon!'
  }
].map((quest) => {
  return _.extend({}, quest, {faction: 'ORDER', points: 400});
});

const chaosQuests = [
  {
    title: 'True Colours of Chaos',
    description: 'Declare yourself to be part of Chaos by painting a Chaos-related art on your skin and showing it at the Larp desk.'
  },
  {
    title: 'Badge of Chaos',
    description: 'Show where you stand by obtaining or creating a Chaos badge for yourself. Claim your reward at the Larp-desk.'
  },
  {
    title: 'Guild Moment: Chaos',
    description: 'Immortalize a moment by taking a photo of yourself with someone dressed as a villain and sharing it on Instagram with the hashtag #RoRchaos. Report then to the Larp desk.'
  },
  {
    title: 'Chaotic Symbols',
    description: 'Form the word CHAOS with 4 of your friends by using only your bodies/props. Then take a picture of the deed and post it on Instagram using hashtag #RoRchaos. Claim your reward at the Larp desk.'
  },
  {
    title: 'Unholy Hymns',
    description: 'Praise the Chaos by writing a chaotic poem. You may share it with the hashtag #RoRchaos. Show your work and claim your reward at the Larp desk.'
  },
  {
    title: 'Herald of Chaos',
    description: 'Persuade one of the Guests of Honor to the ways of Chaos and take a picture with him. You may share it with the hashtag #RoRchaos and/or #ropecon.'
  },
  {
    title: 'Chaos: Boss Fight!',
    description: 'Our victory is at hand! A disgusting champion of Order has spawned in the Hall 5\'s boffer area. Defeat the champion and it\'s minions in a boffer match (or cheer others on) and claim Ropecon for the Chaos!'
  }
].map((quest) => {
  return _.extend({}, quest, {faction: 'CHAOS', points: 400});
});

const errorHandler = (err) => {
  console.log(err);
}

var Quest = mongoose.model('Quest');
var Task = mongoose.model('Task');
var initialQuests = neutralQuests.concat(orderQuests).concat(chaosQuests)
  .map((quest) => {
    return _.extend({}, quest, {code: generateCode()});
  });

Quest.create(initialQuests, errorHandler);
Task.create(initialTasks, errorHandler);
