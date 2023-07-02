const GeneralError = require('../utils/errors/GeneralError');

const errorsGlobalHandler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    res
      .status(err.status)
      .send({ message: err.message });
  } else {
    res
      .status(500)
      .send({ message: `Внутренняя ошибка сервера: ${err}` });
  }
  next();
};

module.exports = errorsGlobalHandler;
