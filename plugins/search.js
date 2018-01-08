const npmKeyword = require('npm-keyword');
const keywords = ['biojs'];

/** Search for biojs modules in npm */
async function search() {
  // Check if there are more than 250 modules
  console.log(await npmKeyword.count(keywords));
}

module.exports = {
  search,
};
