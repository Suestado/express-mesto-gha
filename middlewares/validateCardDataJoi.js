const { celebrate, Joi, Segments } = require('celebrate');
const { linkRegExp } = require('../utils/constants');

const validateCardDataJoi = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegExp),
  })
    .unknown(true),
});

module.exports = validateCardDataJoi;
