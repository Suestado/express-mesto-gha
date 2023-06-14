const { statusNotFound, statusServerError } = require('../utils/constants');
const { ProcessingError } = require('../utils/errors');

function throwError() {
  throw new ProcessingError('Не действительный путь до ресурса');
}

const badRoute = (req, res) => {
  try {
    throwError();
  } catch (err) {
    if (err instanceof ProcessingError) {
      res.status(statusNotFound);
      res.send({ message: err.message });
    } else {
      res.status(statusServerError);
      res.send({ message: `Внутренняя ошибка сервера: ${err}` });
    }
  }
};

module.exports = badRoute;
