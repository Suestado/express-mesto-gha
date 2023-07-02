const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../utils/constants');
const { StatusDenied } = require('../utils/errors/StatusDenied');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new StatusDenied('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${SECRET_KEY}`);
  } catch (err) {
    next(new StatusDenied('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
