#!/usr/bin/env node

var debug = require('debug')('tbp_react');
var app = require('../app');
// var models = require("../models");

app.set('port', process.env.PORT || 8000);

// And now start the server listener.
var server = app.listen(app.get('port'), function () { // localhost only
  // var server = app.listen(app.get('port'), process.env["IP"] || "0.0.0.0", function() { // all interfaces
  debug('Express server listening on port ' + server.address().port);
});

const net = require('net');
const repl = require('repl');
net.createServer((socket) => {
  var r = repl.start({
    prompt: 'repl> ',
    input: socket,
    output: socket
  });
  r.on('exit', function () {
    socket.end();
  });
  // r.context.models = models;
}).listen(process.env.REPL_PORT || 5001);
