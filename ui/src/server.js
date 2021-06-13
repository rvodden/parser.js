// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../../config/webpack.local.config');
console.log('Starting the dev web server...');
const port = 8080;
const path = require('path');

const options = {
    publicPath: config.output.publicPath,
    hot: true,
    inline: true,
    contentBase: 'www',
    stats: { colors: true }
};

const server = new WebpackDevServer(webpack(config), options);

server.asyncListen = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.once('listening', () => {
      resolve(server);
    });
    server.once('error', reject);
  });
};

module.exports = server;
