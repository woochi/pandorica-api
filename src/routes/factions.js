var express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Message = mongoose.model('Message');
import {NEUTRAL, factions} from '../models/faction';
import error from 'http-errors';

module.exports = (socket) => {
  var router = express.Router();

  router.param('faction', (req, res, next, faction) => {
    if (faction === 'global') {
      req.faction === NEUTRAL;
    } else {
      const factionKey = faction.toUpperCase();
      if (!factions[factionKey]) {
        next(error(404, `${faction} is not a valid faction`));
      }
      req.faction = factionKey;
      next();
    }
  });

  router.route('/:faction/messages')
    .all((req, res, next) => {
      if (![req.user.faction, NEUTRAL].includes(req.faction)) {
        next(error(401, 'You do not have access to this faction\'s discussions.'));
      }
      next();
    })
    .get((req, res, next) => {
      Message.find({faction: req.faction}).populate('user').then((messages) => {
        res.json(messages);
      });
    })
    .post((req, res, next) => {
      const message = new Message({
        user: req.user._id,
        faction: req.faction,
        content: req.body.content
      });
      message.save().then((savedMessage) => {
        const messageData = {...savedMessage.toObject(), user: req.user.toJSON()};
        res.json(messageData);
        socket.emit('message', messageData);
      });
    });

  return router;
};
