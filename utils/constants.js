const httpConstants = require('http2').constants;

const statusOk = httpConstants.HTTP_STATUS_OK;
const statusCreated = httpConstants.HTTP_STATUS_CREATED;
const statusModified = httpConstants.HTTP_STATUS_OK;
const statusNotFound = httpConstants.HTTP_STATUS_NOT_FOUND;
const statusBadRequest = httpConstants.HTTP_STATUS_BAD_REQUEST;
const statusServerError = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const statusConflictError = httpConstants.HTTP_STATUS_CONFLICT;
const statusDenied = httpConstants.HTTP_STATUS_UNAUTHORIZED;
const statusForbidden = httpConstants.HTTP_STATUS_FORBIDDEN;

const SECRET_KEY = '31bf9fcad3e346819659afb7e1270dc7161985a7b6e7c85e6246b389e33754ad';

module.exports = {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusBadRequest,
  statusServerError,
  statusConflictError,
  statusDenied,
  statusForbidden,
  SECRET_KEY,
};
