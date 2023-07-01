const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

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
    match: [/^.*(?=.{4,})(?=.*[a-zA-Zа-яА-Я])(?=.*\d)(?=.*[!#$%&? "]).*$/, 'Пароль не соответствует требованиям безопасности']
  },
  name: {
    type: 'string',
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    match: [/^[a-zA-Zа-яА-ЯёË\s]{2,30}$/gi, 'Неверный формат имени']
  },
  about: {
    type: 'string',
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
    match: [/^[a-zA-Zа-яА-ЯёË\s\d]{2,30}$/gi, 'Неверный формат описания']
  },
  avatar: {
    type: 'string',
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return (user);
        });
    });
};

userSchema.plugin(uniqueValidator);

module.exports = model('user', userSchema);
