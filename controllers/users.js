const { CastError, ValidationError } = require('mongoose').MongooseError;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../utils/constants');

const User = require('../models/users');
const {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusBadRequest,
  statusServerError,
  statusConflictError,
} = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => {
      res.status(statusCreated);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.errors.email.kind === 'unique') {
        res.status(statusConflictError);
        res.send({ message: 'Пользователь с таким email уже существует' });
      } else if (err instanceof ValidationError) {
        res.status(statusBadRequest);
        res.send({ message: 'Пользователь не может быть создан. Проверьте введенные данные' });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const logIn = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        `${SECRET_KEY}`,
        { expiresIn: 3600 * 24 * 7 });
      res
        .cookie('jwt', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

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

function findUserById(res, userId) {
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
}

function getParticularUserWrapper(func) {
  return function (req, res) {
    const { userId } = req.params;
    func(res, userId);
  };
}

function getUserMeWrapper(func) {
  return function (req, res) {
    const userId = req.user._id;
    func(res, userId);
  };
}

const getParticularUser = getParticularUserWrapper(findUserById);
const getUserMe = getUserMeWrapper(findUserById);

function updateUserInfo(req, res, userId, newData) {
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
}

function changeUserDataWrapper(func) {
  return function (req, res) {
    const userId = req.user._id;
    const newData = {
      name: req.body.name,
      about: req.body.about,
    };
    func(req, res, userId, newData);
  };
}

function changeUserAvatarWrapper(func) {
  return function (req, res) {
    const userId = req.user._id;
    const newData = {
      avatar: req.body.avatar,
    };
    func(req, res, userId, newData);
  };
}

const changeUserData = changeUserDataWrapper(updateUserInfo);
const changeUserAvatar = changeUserAvatarWrapper(updateUserInfo);

module.exports = {
  logIn,
  getUserMe,
  getUsers,
  getParticularUser,
  createUser,
  changeUserData,
  changeUserAvatar,
};
