require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');
const Recipe = require('../lib/models/Recipe');

describe('event routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  const cookies = {
    name: 'cookies',
    ingredients: [
      { name: 'flour', amount: 1, measurement: 'cup' }
    ],
    directions: [
      'preheat oven to 375',
      'mix ingredients',
      'put dough on cookie sheet',
      'bake for 10 minutes'
    ],
  };

  it('creates an event', () => {
    // create Recipe collection
    return Recipe.create(cookies)
    // then for a recipe
      .then(recipe => {
        return request(app)
        // create this event
          .post('/api/v1/events')
          .send({
            recipeId: recipe.id,
            dateOfEvent: Date.now(),
            notes: 'It went well',
            rating: 4
          })
          // expect to response to include the recipe id and the event info
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              recipeId: recipe.id,
              dateOfEvent: expect.any(String),
              notes: 'It went well',
              rating: 4,
              __v: 0
            });
          });
      });
  });

  it('gets all events', async() => {
    // create recipe instance
    const recipe = await Recipe.create(cookies);
    // create events 
    const events = await Event.create([
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 2 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 5 },
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(event)));
        });
      });
  });

  it('gets an event by id', async() => {
    const recipe = await Recipe.create(cookies);
    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('updates an event by id', async() => {
    const recipe = await Recipe.create(cookies);
    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ rating: 5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 5,
          __v: 0
        });
      });
  });

  it('deletes an event by id', async() => {
    const recipe = await Recipe.create(cookies);
    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .delete(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });
});
