const { celebrate, Joi, Segments } = require('celebrate');
const { urlRegExp, emailRegExp } = require('../utils/constants');

const validateUserDataJoi = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegExp),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
  })
    .unknown(true),
});

module.exports = validateUserDataJoi;
