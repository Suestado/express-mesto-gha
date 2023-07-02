const { celebrate, Joi, Segments } = require('celebrate');

const validateCardPost = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?$/),
  })
    .unknown(true),
});

module.exports = validateCardPost;
