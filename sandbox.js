// configure environment
require('dotenv').config();

// connect to mongodb
require('./lib/utils/connect')();

// import model
const Recipe = require('./lib/models/Recipe');

Recipe
  .findById('5e7408786761c26e40fe1122')
  .populate('events')
  .then(event => console.log(event.toJSON({ virtuals: true })));
