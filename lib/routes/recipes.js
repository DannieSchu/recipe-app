const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  .get('/', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res, next) => {
    // store recipe and all associated events in array
    Promise.all([
      // find a recipe by its id
      Recipe
        .findById(req.params.id),
      // find all events that have a recipe that matches that id
      Event 
        .find({ recipeId: req.params.id })
    ])
      // destructure array into that recipe and associated events
      .then(([recipe, events]) => {
        // send recipe and events as response
        res.send({ ...recipe.toJSON(), events });
      })
      .catch(next);
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Recipe
        .findByIdAndDelete(req.params.id),
      Event
        .deleteMany({ recipeId: req.params.id })
    ])
      // this will return an array with recipe and deleted events. We only want to return recipe so we destructure
      .then(([recipe]) => res.send(recipe));
  });
