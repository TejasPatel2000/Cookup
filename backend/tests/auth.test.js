const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

const User = require('../src/models/user');
const TOTP = require('../src/models/totp');
const { checkUsername } = require('../src/utils');

describe('test authentication endpoints', () => {
  let server;
  let mockUser;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    );

    server = app.listen();
  });

  afterAll(async () => {
    await server.close();
    await mockUser.delete();
    await mongoose.connection.close();
  });

  it('should find a user by their login', async () => {
    mockUser = new User({
      phone: '+19999999999',
      fullName: 'Test User',
      username: 'testUser',
      dob: 0,
    });

    await mockUser.save();

    const byPhone = await User.findByLogin('+19999999999');
    const byUsername = await User.findByLogin('testUser');

    expect(JSON.stringify(byPhone)).toEqual(JSON.stringify(mockUser));
    expect(JSON.stringify(byUsername)).toEqual(JSON.stringify(mockUser));
  });

  it('should authenticate a user by phone', async () => {
    const mockTotp = new TOTP({
      phone: mockUser.phone,
    });

    await mockTotp.save();

    const res = await supertest(server)
      .post('/api/auth/login')
      .send({ login: mockUser.username, token: mockTotp.generate() })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.user.username).toEqual(mockUser.username);
  });
});
// unmocked tst
test('ensure username is valid', () => {
  const username = 'user99999999999';
  expect(checkUsername(username)).toEqual(true);
  expect(checkUsername('notValid')).toEqual(false);
});
