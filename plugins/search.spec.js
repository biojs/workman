const {search} = require('./search');
const {test} = require('tape');

test('search function', (t) => {
  t.ok(search(), 'Search should not fail');
  t.end();
});
