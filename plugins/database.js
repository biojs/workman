const jsonStream = require('JSONstream');
const through2 = require('through2');
const fetch = require('node-fetch');
const R = require('ramda');
const {all} = require('bluebird');
const {get, getPackageDetails} = require('./npm');
const {getGithubInfo} = require('./github');

/**
 * Function to upsert packages into mongoDB
 * @param {Object} config Contains the database instance
 * @return {Function} A function accepting an npm package to upsert
 */
function upsert(config) {
  const {db} = config;
  return async (npmPackage) => {
    npmPackage['_id'] = npmPackage.name;
    try {
      await db.collection('packages')
        .update({_id: npmPackage['_id']}, npmPackage, {upsert: true});
      return npmPackage;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
}

/** Search for biojs modules in npm and update DB
 * @param {object} config settings for search
 * @return {function} search function with settings applied
*/
function updateDb(config) {
  const {
    keywords,
    registry,
    connection,
    token,
    GithubAPI,
    _fetch = fetch} = config;
  if (!connection) {
    throw new Error('No database connection received!');
  }
  const db = connection.db('registry');
  return async () => {
    const base = `${registry}-/v1/search?text=keywords:${keywords.join(',')}`;
    const searchResults = await get(base, 250, 0, _fetch, []);
    const results = searchResults.map((p) => p.package);
    const workflow = R.pipeP(
      getPackageDetails({registry, _fetch}),
      getGithubInfo({token, GithubAPI}),
      upsert({db}),
    );
    const packages = await all(results.map(workflow)).catch(console.error);
    return packages;
  };
}

/**
 * Retrieve all packages from database
 * @param {object} config Object containing the database instance
 * @return {Stream} A stream of packages from the database
 */
function getAll(config) {
  const {connection} = config;
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
  updateDb,
  getAll,
};
