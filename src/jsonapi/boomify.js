const Boom = require('boom');

/**
 * Returns a well formatted Boom error on HttpException
 *
 * @param error {object} an HttpException object with both a message and a statusCode
 *
 * @returns {object}
 */
module.exports = error => {
  if (error.statusCode && error.message) {
    return new Boom(error.message, { statusCode: error.statusCode });
  }

  throw error;
};
