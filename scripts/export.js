var mongoose = require('mongoose');
import bootstrap from './bootstrap';
var qr = require('qr-image');
import gm from 'gm';
import _ from 'lodash';
var mkdirp = require('mkdirp');

bootstrap();

const lineHeight = 24;
var Quest = mongoose.model('Quest');
var Task = mongoose.model('Task');

const handleError = (err) => {
  console.log(err);
};

console.log('Exporting quests...')
Quest.find({}).then((quests) => {
  quests.forEach((quest) => {
    const imageStream = qr.image(`https://app.ropecon.fi/app/quests/${String(quest._id)}?code=${quest.code}`, {
      type: 'png',
      size: 8
    });
    let image = gm(imageStream, 'qr.png')
      .borderColor('#ffffff')
      .border(80, 80)
      .density(512, 512)
      .extent(520, 880)
      .gravity('Center')
      .font("Helvetica.ttf", 6)
      .drawText(0, 100, quest.title)
      .font("Helvetica.ttf", 3)
      .fill('#777')
      .drawText(0, 10, `Or use code in the app: ${quest.code}`);


    _.chunk(quest.description.split(' '), 5).forEach((chunk, i) => {
      image = image.drawText(0, 160 + i * lineHeight, chunk.join(' '));
    })

    mkdirp('./tmp/quests', (err) => {
      console.log('AFTER', err);
      image.write(`tmp/quests/${quest.title}.png`, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log('WROTE IMAGE');
      });
    });
  });
}, handleError);

Task.find({}).then((tasks) => {
  tasks.forEach((task) => {
    const imageStream = qr.image(`https://app.ropecon.fi/app/tasks?code=${task.code}`, {
      type: 'png',
      size: 8
    });
    let image = gm(imageStream, 'qr.png')
      .borderColor('#ffffff')
      .border(80, 80)
      .density(512, 512)
      .extent(520, 880)
      .gravity('Center')
      .font("Helvetica.ttf", 6)
      .drawText(0, 100, 'You found a wild quest!')
      .font("Helvetica.ttf", 3)
      .fill('#777')
      .drawText(0, 10, `Or use code in the app: ${task.code}`)
      .drawText(0, 160, 'Scan the QR code')
      .drawText(0, 160 + lineHeight * 1, 'or use the completion code below')
      .drawText(0, 160 + lineHeight * 2, 'to collect points for your team!');

    mkdirp(`./tmp/tasks/${task.points}`, (err) => {
      console.log('DONE', err);
      image.write(`tmp/tasks/${task.points}/${task._id}.png`, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log('WROTE IMAGE');
      });
    });
  });
}, handleError);
