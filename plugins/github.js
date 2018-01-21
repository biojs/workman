const _GithubAPI = require('github');
const {promisifyAll} = require('bluebird');

/**
 * Retrieve package info from Github
 * @param {Object} config Input containing GitHub Token
 * @return {Object} api
 */
function handler(config) {
  const {token, GithubAPI = _GithubAPI} = config;
  const gh = promisifyAll(new GithubAPI());
  return async (payload) => {
    const {packageInfo} = payload;
    gh.authenticate({
      type: 'oauth',
      token: token,
    });
    try {
      const githubInfo = await gh.repos.get(packageInfo);
      packageInfo.github = githubInfo;
    } catch (e) {
      Promise.reject(new Error(
        `Could not retrieve Github info for ${packageInfo.repo}!`
      ));
    }
    return packageInfo;
  };
}

module.exports = {
  handler,
};
