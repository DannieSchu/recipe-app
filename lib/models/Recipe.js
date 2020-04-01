const mongoose = require('mongoose');

// schema for an ingredient within each recipe
const ingredientsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    enum: ['teaspoon', 'tablespoon', 'cup', 'ounce', 'grams'],
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

// schema for each recipe
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [ingredientsSchema],
  directions: [String]
});

module.exports = mongoose.model('Recipe', schema);
