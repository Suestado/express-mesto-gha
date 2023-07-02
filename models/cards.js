const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
  name: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 30,
    match: [/^[a-zA-Zа-яА-ЯёË\s\d]{2,30}$/gi, 'Неверный формат имени'],
  },
  link: {
    type: 'string',
    required: true,
    match: [/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi, 'Неверный формат ссылки'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: [],
  },
  createdAt: {
    type: 'date',
    default: Date.now,
  },
});

module.exports = model('card', cardSchema);
