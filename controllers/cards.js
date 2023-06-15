const Card = require('../models/cards');
const {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusServerError, statusBadRequest,
} = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

function processErrors(err, req, res) {
  if (err.name === 'NotFoundError') {
    res.status(statusNotFound);
    res.send({ message: err.message });
  } else if (err.name === 'CastError') {
    res.status(statusBadRequest);
    res.send({ message: 'Введен некорректный ID карточки' });
  } else {
    res.status(statusServerError);
    res.send({ message: `Внутренняя ошибка сервера: ${err}` });
  }
}

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(statusServerError);
      res.send({ message: `Внутренняя ошибка сервера: ${err}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(statusCreated);
      res.header('Content-Type', 'application/json');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusBadRequest);
        res.send({ message: 'Карточка не может быть создана. Проверьте введенные данные' });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new ProcessingError('Карточка не была найдена');
      } else {
        res.status(statusOk);
        res.header('Content-Type', 'application/json');
        res.send({ data: card });
      }
    })
    .catch((err) => {
      processErrors(err, req, res);
    });
};

const setLike = (req, res) => {
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
        throw new ProcessingError('Карточка не была найдена');
      } else {
        res.status(statusModified);
        res.header('Content-Type', 'application/json');
        res.send({ data: card });
      }
    })
    .catch((err) => {
      processErrors(err, req, res);
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const user = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: user } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ProcessingError('Карточка не была найдена');
      } else {
        res.status(statusModified);
        res.header('Content-Type', 'application/json');
        res.send({ data: card });
      }
    })
    .catch((err) => {
      processErrors(err, req, res);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
