/**
 * Filter a query by userId.
 * Usefull to force this parameter when a user is logged in, for instance.
 *
 * @param query {object} A representation of the query params
 * @param userId {string} An unique user identifier
 *
 * @returns {object}
 */
module.exports = (query, userId) => Object.assign({}, query, { 'filter[userId]': userId });
