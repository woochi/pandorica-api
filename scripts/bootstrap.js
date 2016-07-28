import mongoose from 'mongoose';
var path = require('path');
var fs = require('fs');

const env = process.env.NODE_ENV || 'development';
var config = require('../src/config/environments/' + env);

function connectToDatabase() {
  return mongoose.connect(config.db).connection;
}

function bootstrap() {

  var models = path.join(__dirname, '../src/models');

  // Bootstrap models
  fs.readdirSync(models)
    .filter(file => ~file.indexOf('.js'))
    .forEach(file => require(path.join(models, file)));

  connectToDatabase()
    .on('error', console.log)
}

export default bootstrap;
