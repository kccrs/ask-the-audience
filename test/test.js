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

describe("server", () => {

  let client1 = io.connect(socketURL, options);
  let client2 = io.connect(socketURL, options);

  it('should display the number 1 if one user has connected', () => {

    client1.on('connection', () => {
      client1.emit('A user has connected', io.engine.clientsCount);
      io.engine.clientsCount.should.equal(1);
    });
  });

  it('should display the number 2 if two users are connected', () => {

    client2.on('connection', () => {
      client2.emit('A user has connected', io.engine.clientsCount);
      io.engine.clientsCount.should.equal(2);
    });
  });

  it('should display the number 1 after one user has disconnected', () => {

    client2.on('disconnect', (done) => {
      io.engine.clientsCount.should.equal(1);
      done();
    });
  });

  it('should display the number 0 when all users have disconnected', () => {

    client1.on('disconnect', (done) => {
      io.engine.clientsCount.should.equal(0);
      done();
    });
  });

});
