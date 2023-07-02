const GeneralError = require('./GeneralError');
const { statusBadRequest } = require('../constants');

class BadRequest extends GeneralError {
  constructor(message) {
    super();
    this.message = message || 'Неверный запрос, проверьте введенные данные';
    this.status = statusBadRequest;
  }
}

module.exports = BadRequest;
