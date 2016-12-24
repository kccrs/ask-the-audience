var socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var buttons = document.querySelectorAll('#choices button');
var liA = document.getElementById('A');
var liB = document.getElementById('B');
var liC = document.getElementById('C');
var liD = document.getElementById('D');
var userChoice = document.getElementById('userChoice');

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    console.log(this.innerText);
    socket.send('voteCast', this.innerText);
  });
}


socket.on('voteCount', function(votes) {
  liA.innerText = 'Total votes - A: ' + votes.A;
  liB.innerText = 'Total votes - B: ' + votes.B;
  liC.innerText = 'Total votes - C: ' + votes.C;
  liD.innerText = 'Total votes - D: ' + votes.D;
  console.log(votes);
});

socket.on('userChoice', function(userVote) {
  userChoice.innerText = 'You have voted for : ' + userVote;
});
