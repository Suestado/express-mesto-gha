const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const StatusDenied = require('../utils/errors/StatusDenied');

const userSchema = new Schema({
  email: {
    type: 'string',
    required: true,
    unique: true,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9-]+.[A-Z]{2,4}$/img, 'Неверный формат email'],
  },
  password: {
    type: 'string',
    required: true,
    minLength: 4,
    select: false,
  },
  name: {
    type: 'string',
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: 'string',
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: 'string',
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: [/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi, 'Неверный формат ссылки'],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new StatusDenied('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new StatusDenied('Неправильные почта или пароль'));
          }
          return (user);
        });
    });
};

userSchema.set('toJSON', {
  function(doc, ret) {
    const newRet = ret;
    delete newRet.password;
    return newRet;
  },
});

userSchema.plugin(uniqueValidator);

module.exports = model('user', userSchema);
