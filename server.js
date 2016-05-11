#!/usr/bin/env node

/**
 * Module dependencies.
 */

var debug = require('debug')('pandorica-api:server');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
var config = require('./config/environments/' + process.env.NODE_ENV);

var models = path.join(__dirname, 'app/models');

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(path.join(models, file)));

/**
 * Get port from environment and store in Express.
 */

var app = require('./app');
var port = normalizePort(config.port || process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

function listen() {
  console.log('Starting up app on port', port);
  server.listen(port, '0.0.0.0');
  server.on('error', onError);
  server.on('listening', onListening);
}

function connectToDatabase() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };
  return mongoose.connect(config.db, options).connection;
}

connectToDatabase()
  .on('error', console.log)
  .on('disconnect', connectToDatabase)
  .once('open', listen);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
