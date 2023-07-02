const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { CastError, ValidationError } = require('mongoose').MongooseError;
const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const ConflictRequest = require('../utils/errors/ConflictRequest');
const SECRET_KEY = require('../utils/constants');

const User = require('../models/users');
const {
  statusOk,
  statusCreated,
  statusModified,
} = require('../utils/constants');

const logIn = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        `${SECRET_KEY}`,
        { expiresIn: 3600 * 24 * 7 },
      );
      res.cookie(
        'jwt',
        token,
        {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        },
      );
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        email, password: hash, name, about, avatar,
      },
    ))
    .then((user) => {
      logIn(req, res, next);
      // res.status(statusCreated);
      // res.header('Content-Type', 'application/json');
      // res.send({ data: user });
    })
    .catch((err) => {
      if (err.errors?.email?.kind === 'unique') {
        next(new ConflictRequest('Пользователь с таким email уже существует'));
      } else if (err instanceof ValidationError) {
        next(new BadRequest('Пользователь не может быть создан. Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

function findUserById(res, userId, next) {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(statusOk);
        res.header('Content-Type', 'application/json');
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest('Введен некорректный ID пользователя'));
      } else {
        next(err);
      }
    });
}

function getParticularUserWrapper(func) {
  return function (req, res, next) {
    const { userId } = req.params;
    func(res, userId, next);
  };
}

function getUserMeWrapper(func) {
  return function (req, res, next) {
    const userId = req.user._id;
    func(res, userId, next);
  };
}

const getParticularUser = getParticularUserWrapper(findUserById);
const getUserMe = getUserMeWrapper(findUserById);

function updateUserInfo(req, res, userId, newData, next) {
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
        next(new BadRequest('Ошибка обновления данных пользователя. Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
}

function changeUserDataWrapper(func) {
  return function (req, res, next) {
    const userId = req.user._id;
    const newData = {
      name: req.body.name,
      about: req.body.about,
    };
    func(req, res, userId, newData, next);
  };
}

function changeUserAvatarWrapper(func) {
  return function (req, res, next) {
    const userId = req.user._id;
    const newData = {
      avatar: req.body.avatar,
    };
    func(req, res, userId, newData, next);
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
