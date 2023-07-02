const GeneralError = require('./GeneralError');
const { statusConflictError } = require('../constants');

class ConflictRequest extends GeneralError {
  constructor(message) {
    super();
    this.message = message || 'Возник конфликт при попытке провести операцию. Проверьте введенные данные';
    this.status = statusConflictError;
  }
}

module.exports = ConflictRequest;
