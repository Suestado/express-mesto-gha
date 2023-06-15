const { Schema, model } = require('mongoose');

const cardSchema = new Schema({
  name: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: 'string',
    required: true,
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
