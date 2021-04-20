const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

const User = require('../src/models/user');
const { checkRequired } = require('../src/utils');


describe('test recipe endpoints', () => {
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

    mockUser = new User({
      phone: '+19999999999',
      fullName: 'Test User',
      username: 'testUser',
      dob: 0,
    });

    await mockUser.save();

    User.findByLogin = jest.fn(() => mockUser);

    server = app.listen();
  });

  afterAll(async () => {
    await server.close();
    await mockUser.delete();
    await mongoose.connection.close();
  });

  it('should create a recipe', async () => {
    const res = await supertest(server)
      .post('/api/recipe/post')
      .send({
        name: 'Test Recipe',
        description: 'test description',
      })
      .set('Accept', 'application/json');

    expect(res.body.success).toEqual(true);
  });
});

// Unmocked test
describe('test required recipe fields are not empty', () => {
  var name = "test Name";
  var description = "test description";
  
  expect(checkRequired(name, description)).toEqual(true);
  expect(checkRequired('', '')).toEqual(false);
});
