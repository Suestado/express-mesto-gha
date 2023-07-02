const GeneralError = require('./GeneralError');
const { statusDenied } = require('../constants');

class StatusDenied extends GeneralError {
  constructor(message) {
    super();
    this.message = message || 'Запрос отклонен. Вы не авторизованы или у вас нет прав на совершение данного действия';
    this.status = statusDenied;
  }
}

module.exports = StatusDenied;
