var http = require('http');
var express = require('express');
var _ = require('lodash');

var app = express();
var votes = {};

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;

var server = http.createServer(app)
                 .listen(port, function () {
                  console.log('Listening on port ' + port + '.');
                });

var socketIo = require('socket.io');
var io = socketIo(server);

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (var vote in votes) {
    voteCount[votes[vote]]++;
  }
  return voteCount;
}

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    console.log(channel, message);
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('userChoice', message);
      io.emit('voteCount', countVotes(votes));
      console.log(votes);
    }
    if (channel === 'userChoice') {

    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    console.log(votes);
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});


module.exports = server;
