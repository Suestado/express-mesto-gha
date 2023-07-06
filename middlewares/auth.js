const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../utils/constants');
const StatusDenied = require('../utils/errors/StatusDenied');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new StatusDenied('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, `${SECRET_KEY}`);
  } catch (err) {
    next(new StatusDenied('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
