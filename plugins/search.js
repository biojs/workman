const fetch = require('node-fetch');

/**
 * Get packages from API
 * @param {string} url Url to fetch
 * @param {string} size Number of packages to fetch
 * @param {string} from pagination
 * @param {function} fetch fetch function
 * @param {Array} packages The accumulator or packages
 * @return {Array} final list of packages
 */
async function get(url, size, from, fetch, packages) {
  // TODO: Change this to use streams directly.
  const res = await fetch(url + '&size=' + size + '&from=' + from);
  const json = await res.json();
  if (json.objects.length < 250) {
    return packages.concat(json.objects);
  }
  return await get(url, size, from + 250, fetch, packages.concat(json.objects));
}

/** Search for biojs modules in npm and update DB
 * @param {object} payload settings for search
 * @return {function} search function with settings applied
*/
function updateDb(payload) {
  const {keywords, registry, connection, _fetch = fetch} = payload;
  if (!connection) {
    throw new Error('No database connection received!');
  }
  const db = connection.db('registry');
  return async () => {
    const base = `${registry}-/v1/search?text=keywords:${keywords.join(',')}`;
    // get packages as long as available
    const packages = await get(base, 250, 0, _fetch, []);
    await db.collection('packages').insertMany(packages);
    return packages;
  };
}

module.exports = {
  updateDb,
  get,
};
