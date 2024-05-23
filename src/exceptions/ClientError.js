class ClientError extends Error {
  constructor(message, statusCode = 413) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
