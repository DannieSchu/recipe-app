const mongoose = require('mongoose');

// schema of each ingredient for recipe 
const ingredientSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    required: true,
    enum: ['teaspoon', 'tablespoon', 'cup', 'ounce', 'grams']
  },
  name: {
    type: String,
    required: true
  }
});

// recipe schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  directions: [String]
});

// populate all events for recipe
schema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'recipeId'
});

module.exports = mongoose.model('Recipe', schema);
