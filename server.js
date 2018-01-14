const Promise = require('bluebird');
const {MongoClient} = Promise.promisifyAll(require('mongodb'));
const {Server} = require('hapi');
const {updateDb} = require('./plugins/search');
const {getAll} = require('./plugins/database');
const {update} = require('./plugins/update');
const config = require('config');


/** Initialise server
 * @return {object} A promise resolving to the server instance
 */
async function init({_config = config}) {
  const server = new Server({
    port: _config.get('server.port'),
    routes: {
      cors: true,
    },
  });
  console.log('Done.');

  const dbUri = _config.get('db.uri');
  console.log(`Connecting to mongodb on ${dbUri}...`);
  const connection = await MongoClient.connect(dbUri);
  console.log('Done.');

  server.route({
    method: 'GET',
    path: '/all',
    handler: getAll({
      connection,
    }),
  });

  server.route({
    method: 'GET',
    path: '/update',
    handler: updateDb({
      keywords: _config.get('keywords'),
      registry: _config.get('registry.uri'),
      connection,
    }),
  });

  update({
    keywords: _config.get('keywords'),
    registry: _config.get('registry.uri'),
    interval: _config.get('update.interval'),
    connection,
  });

  return server;
}

module.exports = {
  init,
};
