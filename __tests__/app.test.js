require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');

describe('app routes', () => {
  // connect to database
  beforeAll(() => {
    connect();
  });
  // drop database connection
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  // close database connection
  afterAll(() => {
    return mongoose.connection.close();
  });

  // store test recipe
  const cookieRecipe = {
    name: 'cookies',
    ingredients: [{
      amount: 1,
      measurement: 'teaspoon',
      name: 'vanilla'
    }],
    directions: [
      'preheat oven to 375',
      'mix ingredients',
      'put dough on cookie sheet',
      'bake for 10 minutes'
    ]
  };

  // test route to post recipe
  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send(cookieRecipe)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          __v: 0,
          name: 'cookies',
          ingredients: [{
            _id: expect.any(String),
            amount: 1,
            measurement: 'teaspoon',
            name: 'vanilla'
          }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  // test route to get all recipes
  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', ingredients: [], directions: [] },
      { name: 'cake', ingredients: [],  directions: [] },
      { name: 'pie', ingredients: [],  directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });
  
  // test route to get one recipe using id in params
  it('gets a recipe by its id', async() => {
    const recipe = await Recipe.create(cookieRecipe);

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: recipe._id.toString(),
          name: 'cookies',
          ingredients: [{
            _id: expect.any(String),
            amount: 1,
            measurement: 'teaspoon',
            name: 'vanilla'
          }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  // test route to update a recipe with patch taking id from params
  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create(cookieRecipe);

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          ingredients: [{
            _id: expect.any(String),
            amount: 1,
            measurement: 'teaspoon',
            name: 'vanilla'
          }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          __v: 0
        });
      });
  });

  // test route to delete recipe by its id in params
  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.create(cookieRecipe);  

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: recipe._id.toString(),
          name: 'cookies',
          ingredients: [{
            _id: expect.any(String),
            amount: 1,
            measurement: 'teaspoon',
            name: 'vanilla'
          }],
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
});
