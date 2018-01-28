const {updateDb} = require('./database');
const {test} = require('tape');
const {stub} = require('sinon');

test('search function', async (t) => {
  const mockFetch = stub().returns(
    Promise.resolve({
      json: () => Promise.resolve({
          total: 60,
          objects: new Array(60).fill({package: {}}),
        }
      ),
    })
  );

  const connection = {
    db: () => ({
      collection: stub().returns({
        update: () => Promise.resolve('success!'),
      }),
    }),
  };

  const GithubAPI = stub().returns({
    authenticate: stub(),
  });

  const packages = await updateDb({
    registry: 'http://example.com',
    keywords: [],
    connection,
    GithubAPI,
    _fetch: mockFetch,
  }
  )();
  t.ok(packages, 'Search should not fail');
  t.equals(packages.length, 60, 'Right amount of packages');
  t.end();
});
