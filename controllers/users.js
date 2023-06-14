const User = require('../models/users');
const {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusServerError,
} = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new ProcessingError('Пользователи не найдены');
      }
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch((err) => {
      if (err instanceof ProcessingError) {
        res.status(statusNotFound);
        res.send({ message: err.message });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const getParticularUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ProcessingError('Пользователь с таким ID не найден');
      }
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ProcessingError) {
        res.status(statusNotFound);
        res.send({ message: err.message });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new ProcessingError('Ошибка при создании пользователя');
      } else {
        res.status(statusCreated);
        res.header('Content-Type', 'application/json');
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof ProcessingError) {
        res.status(statusNotFound);
        res.send({ message: err.message });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const newData = req.body;

  User.findByIdAndUpdate(
    userId,
    newData,
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new ProcessingError('Пользователь с таким ID не найден');
      } else {
        res.status(statusModified);
        res.header('Content-Type', 'application/json');
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof ProcessingError) {
        res.status(statusNotFound);
        res.send({ message: err.message });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

module.exports = {
  getUsers,
  getParticularUser,
  createUser,
  updateUserInfo,
};
