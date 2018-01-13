const {promisify} = require('bluebird');

/**
 * Retrieve all packages from database
 * @param {object} payload Object containing the database instance
 * @return {Stream} A stream of packages from the database
 */
function getAll(payload) {
  if (!payload.db) {
    throw new Error('No database instance received!');
  }
  const mongo = promisify(payload.db);

  return async () => {
    const connection = await mongo.open();
    const db = connection.db('registry');
    return db.collection('packages').find({}).stream();
  };
}

module.exports = {
  getAll,
};
