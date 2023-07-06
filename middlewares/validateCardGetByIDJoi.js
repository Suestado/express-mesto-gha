const { celebrate, Joi } = require('celebrate');

const validateCardGetByIDJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  })
    .unknown(true),
});

module.exports = validateCardGetByIDJoi;
