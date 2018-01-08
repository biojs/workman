const {Server} = require('hapi');
const {search} = require('./plugins/search');


/** Initialise server
 * @return {object} A promise resolving to the server instance
 */
async function init() {
  const server = new Server({port: 3000, host: 'localhost'});

  server.route({
    method: 'GET',
    path: '/search',
    handler: search,
  });

  return server;
}

module.exports = {
  init,
};
