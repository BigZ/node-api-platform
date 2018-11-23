const axios = require('axios');
const getPem = require('rsa-pem-from-mod-exp');
const jws = require('jws');
const jwtDecode = require('jwt-decode');

function HttpException(message = 'Error', statusCode = 500) {
  this.message = message;
  this.statusCode = statusCode;
}

const getAccountApiUrl = method =>
  `https://accounts.${process.env.GIGYA_DATACENTER}/accounts.${method}?apiKey=${
    process.env.GIGYA_API_KEY
  }`;

const getJWTPublicKey = () =>
  axios.get(getAccountApiUrl('getJWTPublicKey')).then(response => response.data);

/**
 * Get the userId out of a gigya JWT, or throws an error in case of a bad signature.
 *
 * @param request {object} an Hapi request object
 *
 * @returns {object}
 */
module.exports = request => {
  const token = request.headers['x-auth-token'];

  if (!token) {
    throw new HttpException('Unauthorized: no token found', 403);
  }

  return getJWTPublicKey().then(apiKey => {
    const pem = getPem(apiKey.n, apiKey.e);
    const isValid = jws.verify(token, 'RS256', pem);

    if (isValid === false) {
      throw new HttpException('Unauthorized', 403);
    }

    const { sub = null } = jwtDecode(token);

    if (sub === null) {
      throw new HttpException('Bad request: no UID Found', 400);
    }

    return sub;
  });
};
