const { celebrate, Joi } = require('celebrate');

const validateCardGetByIDJoi = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/^[a-z\d]{24}$/),
  })
    .unknown(true),
});

module.exports = validateCardGetByIDJoi;
