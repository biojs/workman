const jsonStream = require('JSONstream');
const through2 = require('through2');

/**
 * Retrieve all packages from database
 * @param {object} payload Object containing the database instance
 * @return {Stream} A stream of packages from the database
 */
function getAll(payload) {
  const {connection} = payload;
  if (!connection) {
    throw new Error('No database connection received!');
  }
  const db = connection.db('registry');
  return async () => {
    const res = db.collection('packages')
      .find({})
      .stream()
      .pipe(jsonStream.stringify())
      // This is needed to provide the Stream2 interface hapi expects
      .pipe(through2());
    return res;
  };
}

module.exports = {
  getAll,
};
