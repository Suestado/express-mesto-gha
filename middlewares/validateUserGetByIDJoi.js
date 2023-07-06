const { celebrate, Joi } = require('celebrate');

const validateUserGetByIDJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  })
    .unknown(true),
});

module.exports = validateUserGetByIDJoi;
