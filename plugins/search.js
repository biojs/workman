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
  const res = await fetch(url + '&size=' + size + '&from=' + from);
  if (res.objects.length < 250) {
    return packages.concat(res.objects);
  }
  return await get(url, size, from + 250, fetch, packages.concat(res.objects));
}

/** Search for biojs modules in npm
 * @param {object} payload settings for search
 * @return {function} search function with settings applied
*/
function search(payload) {
  const {keywords, registry, _fetch = fetch} = payload;
  return async () => {
    const base = `${registry}-/v1/search?text=keywords:${keywords.join(',')}`;
    // get packages as long as available
    const packages = await get(base, 250, 0, _fetch, []);
    return packages;
  };
}

module.exports = {
  search,
  get,
};
