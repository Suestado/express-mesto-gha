const GeneralError = require('./GeneralError');
const { statusForbidden } = require('../constants');

class ForbiddenRequest extends GeneralError {
  constructor(message) {
    super();
    this.message = message || 'Отсутствуют права на совершение действия';
    this.status = statusForbidden;
  }
}

module.exports = ForbiddenRequest;
