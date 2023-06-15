const { CastError, ValidationError } = require('mongoose').MongooseError;

const User = require('../models/users');
const {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusBadRequest,
  statusServerError,
} = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(statusServerError);
      res.send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const getParticularUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ProcessingError('Пользователь не найден');
      } else {
        res.status(statusOk);
        res.header('Content-Type', 'application/json');
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof ProcessingError) {
        res.status(statusNotFound);
        res.send({ message: err.message });
      } else if (err instanceof CastError) {
        res.status(statusBadRequest);
        res.send({ message: 'Введен некорректный ID пользователя' });
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
      res.status(statusCreated);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(statusBadRequest);
        res.send({ message: 'Пользователь не может быть создан. Проверьте введенные данные' });
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
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(statusModified);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(statusBadRequest);
        res.send({ message: 'Ошибка обновления данных пользователя. Проверьте введенные данные' });
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
