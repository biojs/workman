const R = require('ramda');

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

/**
 * Function retrieving additional details about a package from npm
 * @param {Object} config Payload containing registry url
 * @return {Function} returns a function that receives the orinigal package and
 * returns a promise resolving to the original package with additional details
 */
function getPackageDetails(config) {
  const {registry, _fetch} = config;
  return async (npmPackage) => {
    try {
      const res = await _fetch(`${registry}${npmPackage.name}/latest`)
        .catch((err) => console.error(err));
      const details = await res.json();
      const merged = R.merge(npmPackage, details);
      merged['_details'] = true;
      return merged;
    } catch (e) {
      console.error(`Couldn't get details for ${npmPackage.name}! ${e}`);
      npmPackage['_details'] = false;
      return npmPackage;
    }
  };
}

module.exports = {
  get,
  getPackageDetails,
};
