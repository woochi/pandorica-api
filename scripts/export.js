var mongoose = require('mongoose');
import bootstrap from './bootstrap';
var qr = require('qr-image');
import gm from 'gm';
import _ from 'lodash';

bootstrap();

var Quest = mongoose.model('Quest');
var Task = mongoose.model('Task');

const handleError = (err) => {
  console.log(err);
};

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

    const lineHeight = 24;
    _.chunk(quest.description.split(' '), 5).forEach((chunk, i) => {
      image = image.drawText(0, 160 + i * lineHeight, chunk.join(' '));
    })

    image.write(`tmp/${quest._id}.png`, (error) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log('WROTE IMAGE');
    });
    /*
    qrImage.size((err, size) => {
      console.log('SIZE', size);
      qrImage
        .extent(size.width, size.height + 200)
        .write(`tmp/${quest._id}.png`, (error) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log('WROTE IMAGE');
        });
    });
    */
  });
}, handleError);
