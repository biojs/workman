const _GithubAPI = require('github');
const {promisifyAll} = require('bluebird');

/**
 * Extract owner and repo name from gh url
 * @param {String} url github url
 * @return {Object} owner and repo
 */
function extractOwner(url) {
  const split = url.split('/');
  const owner = split[split.length - 2];
  const repo = split[split.length - 1].split('.git')[0];
  return {owner, repo};
}

/**
 * Retrieve package info from Github
 * @param {Object} config Input containing GitHub Token
 * @return {Object} api
 */
function getGithubInfo(config) {
  const {token, GithubAPI = _GithubAPI} = config;
  const gh = promisifyAll(new GithubAPI());
  return async (npmPackage) => {
    try {
      await gh.authenticate({type: 'oauth', token: token});
    } catch (e) {
      console.error('Github authentication failed!');
      Promise.reject(e);
    }
    const repository = npmPackage.repository;
    if (repository && repository.type === 'git') {
      try {
        const githubOwner = extractOwner(repository.url);
        const githubInfo = await gh.repos.get(githubOwner);
        npmPackage['github'] = githubInfo['data'];
      } catch (e) {
        console.error(`Couldn't retrieve Github info for ${npmPackage.name}!`);
      }
    }
    return npmPackage;
  };
}

module.exports = {
  getGithubInfo,
  extractOwner,
};
