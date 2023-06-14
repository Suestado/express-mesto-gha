const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: 'string',
    required: true,
  },
});

module.exports = model('user', userSchema);
