const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('#choices button');
const liA = document.getElementById('A');
const liB = document.getElementById('B');
const liC = document.getElementById('C');
const liD = document.getElementById('D');
const userChoice = document.getElementById('userChoice');

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message;
});

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    console.log(this.innerText);
    socket.send('voteCast', this.innerText);
  });
}

socket.on('voteCount', (votes) => {
  liA.innerText = 'Total votes - A: ' + votes.A;
  liB.innerText = 'Total votes - B: ' + votes.B;
  liC.innerText = 'Total votes - C: ' + votes.C;
  liD.innerText = 'Total votes - D: ' + votes.D;
  console.log(votes);
});

socket.on('userChoice', (userVote) => {
  userChoice.innerText = 'You have voted for : ' + userVote;
});
