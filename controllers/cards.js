const Card = require('../models/cards');
const {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusServerError, statusBadRequest,
} = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        throw new ProcessingError('Карточки не найдены');
      } else {
        res.status(statusOk);
        res.header('Content-Type', 'application/json');
        res.send({ data: cards });
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
      res.status(statusOk);
      res.header('Content-Type', 'application/json');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusBadRequest);
        res.send({ message: 'Карточка с таким ID не была найдена' });
      } else {
        res.status(statusServerError);
        res.send({ message: `Внутренняя ошибка сервера: ${err}` });
      }
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
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
