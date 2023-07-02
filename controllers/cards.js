const { CastError, ValidationError } = require('mongoose').MongooseError;
const { BadRequest } = require('../utils/errors/BadRequest');
const { NotFound } = require('../utils/errors/NotFound');

const Card = require('../models/cards');
const {
  statusOk,
  statusCreated,
  statusModified,
} = require('../utils/constants');

function processErrors(err, req, res, next) {
  if (err instanceof CastError) {
    next(new BadRequest('Введен некорректный ID карточки'));
  } else {
    next(err);
  }
}

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(statusCreated);
      res.header('Content-Type', 'application/json');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest('Карточка не может быть создана. Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не была найдена');
      } else if (card.owner.valueOf() !== userId) {
        throw new BadRequest('Нет прав на удаление карточки');
      } else {
        Card.findByIdAndRemove(cardId)
          .then((deletedCard) => {
            res.status(statusOk);
            res.header('Content-Type', 'application/json');
            res.send({ data: deletedCard });
          });
      }
    })
    .catch((err) => {
      processErrors(err, req, res, next);
    });
};

const setLike = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: user } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не была найдена');
      } else {
        res.status(statusModified);
        res.header('Content-Type', 'application/json');
        res.send({ data: card });
      }
    })
    .catch((err) => {
      processErrors(err, req, res, next);
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: user } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не была найдена');
      } else {
        res.status(statusModified);
        res.header('Content-Type', 'application/json');
        res.send({ data: card });
      }
    })
    .catch((err) => {
      processErrors(err, req, res, next);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
