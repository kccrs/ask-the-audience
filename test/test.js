const request = require('supertest');
const app = require('../server');
const io = require('socket.io-client');
const socketURL = 'http://localhost:3000';

describe('GET /', () => {
  it('responds with success', (done) =>{
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('undefined routes', () => {
  it('respond with a 404', (done) =>{
    request(app)
      .get('/not-real')
      .expect(404, done);
  });
});

let options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("user connections", () => {

  let client1 = io.connect(socketURL, options);
  let client2 = io.connect(socketURL, options);

  it('should count 1 if one user has connected', () => {

    client1.on('connection', () => {
      client1.emit('A user has connected', io.engine.clientsCount);
      io.engine.clientsCount.should.equal(1);
    });
  });

  it('should count 2 if two users are connected', () => {

    client2.on('connection', () => {
      client2.emit('A user has connected', io.engine.clientsCount);
      io.engine.clientsCount.should.equal(2);
    });
  });

  it('should count 1 after one user has disconnected', () => {

    client2.on('disconnect', (done) => {
      io.engine.clientsCount.should.equal(1);
      done();
    });
  });

  it('should count 0 when all users have disconnected', () => {

    client1.on('disconnect', (done) => {
      io.engine.clientsCount.should.equal(0);
      done();
    });
  });

});

describe('single user connection message', () => {

  it('should display message to user that they have connected', () => {

    let client1 = io.connect(socketURL, options);
    let message = 'Hello World';

    let checkMessage = (client, done) => {
      client1.on('message', (msg) => {
        message.should.equal(msg);
        client1.disconnect();
        done();
      });
    };

    client1.on('connect', () => {
      checkMessage(client1);
    });
  });

});

describe("user connection display", () => {

  let client1 = io.connect(socketURL, options);
  let client2 = io.connect(socketURL, options);


  let checkMessage = (num, client, done) => {
    let message = 'Connected Users: ' + num;
    client.on('message', (msg) => {
      message.should.equal(msg);
      client.disconnect();
      done();
    });
  };

  it('should display "Connected Users: 1" if one user has connected', () => {

    client1.on('connection', () => {
      checkMessage(1, client1);
    });
  });

  it('should display "Connected Users: 2" on each user page if two users has connected', () => {

    client2.on('connection', () => {
      checkMessage(2, client1);
      checkMessage(2, client2);
    });
  });

  it('should display "Connected Users: 1" if one user has disconnected', () => {

    client1.on('connection', () => {
      checkMessage(1, client1);
    });

    client2.on('connection', () => {
      checkMessage(2, client2);
    });

    client2.on('disconnect', () => {
      checkMessage(1, client1);
    });
  });

});
