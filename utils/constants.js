const httpConstants = require('http2').constants;

const statusOk = httpConstants.HTTP_STATUS_OK;
const statusCreated = httpConstants.HTTP_STATUS_CREATED;
const statusModified = httpConstants.HTTP_STATUS_OK;
const statusNotFound = httpConstants.HTTP_STATUS_NOT_FOUND;
const statusBadRequest = httpConstants.HTTP_STATUS_BAD_REQUEST;
const statusServerError = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = {
  statusOk,
  statusCreated,
  statusModified,
  statusNotFound,
  statusBadRequest,
  statusServerError,
};
