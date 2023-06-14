const middlewares = require('express').Router();

middlewares.use((req, res, next) => {
  req.user = {
    _id: '6486fbb7d9a4e3794867fab2',
  };
  next();
});

module.exports = middlewares;
