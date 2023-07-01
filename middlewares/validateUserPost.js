const { celebrate, Joi,Segments } = require('celebrate');

const validateUserPost = celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(4),
    })
      .unknown(true),
  })

module.exports = validateUserPost;
