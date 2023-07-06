const { celebrate, Joi, Segments } = require('celebrate');
const { urlRegExp } = require('../utils/constants');

const validateUserUpdateJoi = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
  })
    .unknown(true),
});

module.exports = validateUserUpdateJoi;
