const jwt = require('jsonwebtoken');
const SECRET_KEY = require('../utils/constants');
const StatusDenied = require('../utils/errors/StatusDenied');
const { logIn } = require('../controllers/users');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie.replace('jwt=', '');
  console.log(authorization);

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   throw new StatusDenied('Необходима авторизация');
  // }

  // const token = authorization.replace('Bearer ', '');
  let payload;
  const token = authorization;


  try {
    payload = jwt.verify(token, `${SECRET_KEY}`);
  } catch (err) {
    next(new StatusDenied('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
