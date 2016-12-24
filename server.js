const http = require('http');
const express = require('express');

const app = express();
const votes = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

var server = http.createServer(app)
                 .listen(port, () => {
                  console.log('Listening on port ' + port + '.');
                });

const socketIo = require('socket.io');
const io = socketIo(server);

// TODO: Find another way to write below function using lodash

let countVotes = (votes) => {
  let voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (let vote in votes) {
    voteCount[votes[vote]]++;
  }
  return voteCount;
};

io.on('connection', (socket) => {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', (channel, message) => {
    console.log(channel, message);
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('userChoice', message);
      io.emit('voteCount', countVotes(votes));
      console.log(votes);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user has disconnected', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    console.log(votes);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});


module.exports = server;
