/* eslint-disable global-require */

try {
  const nodeExternals = require('webpack-node-externals');

  module.exports = {
    context: `${__dirname}/app`,
    mode: 'development',
    entry: '../../../../../app/server.js',
    target: 'node',
    externals: [nodeExternals()]
  };
} catch (error) {
  module.exports = {};
}
