const NotFound = require('../utils/errors/NotFound');

function throwError() {
  throw new NotFound('Не действительный путь до ресурса');
}

const badRoute = (req, res, next) => {
  try {
    throwError();
  } catch (err) {
    next(err);
  }
};

module.exports = badRoute;
