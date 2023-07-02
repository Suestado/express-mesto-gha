const GeneralError = require('./GeneralError');
const { statusNotFound } = require('../constants');

class NotFound extends GeneralError {
  constructor(message) {
    super();
    this.message = message || 'Данные не найдены. Проверьте введенный запрос';
    this.status = statusNotFound;
  }
}

module.exports = NotFound;
