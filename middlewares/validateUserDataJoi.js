const { celebrate, Joi, Segments } = require('celebrate');

const validateUserDataJoi = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}$/),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
  })
    .unknown(true),
});

module.exports = validateUserDataJoi;