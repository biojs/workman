const {Server} = require('hapi');
const {search} = require('./plugins/search');
const config = require('config');


/** Initialise server
 * @return {object} A promise resolving to the server instance
 */
async function init({_config = config}) {
  const server = new Server({
    port: _config.get('server.port'),
    host: _config.get('server.host'),
  });

  server.route({
    method: 'GET',
    path: '/search',
    handler: search({
      keywords: _config.get('keywords'),
      registry: _config.get('registry.uri'),
    }),
  });

  return server;
}

module.exports = {
  init,
};
