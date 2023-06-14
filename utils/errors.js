class ProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  ProcessingError,
};
