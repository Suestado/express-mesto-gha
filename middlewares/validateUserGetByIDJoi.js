const { celebrate, Joi } = require('celebrate');

const validateUserGetByIDJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().pattern(/^[a-z\d]{24}$/),
  })
    .unknown(true),
});

module.exports = validateUserGetByIDJoi;
