const User = require('../models/users');

// getUsers, getParticularUser, createUser

const getUsers = (req, res) => {
  User.find({})
    .then(users => {
      res.status(200);
      res.header('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch(err => {
      res.status(500);
      res.send({ message: `Произошла ошибка при запросе пользователя: ${err}` });
    });
};

const getParticularUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      res.status(200);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch(err => {
      res.status(500);
      res.send({ message: `Произошла ошибка при запросе пользователя: ${err}` });
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => {
      res.status(201);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch(err => {
      res.status(500);
      res.send({ message: `Произошла ошибка при создании пользователя: ${err}` });
    })
};

module.exports = {
  getUsers,
  getParticularUser,
  createUser,
};
