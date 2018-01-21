const {updateDb} = require('./database');
const {get} = require('./npm');
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

  const packages = await updateDb({
    registry: 'http://example.com',
    keywords: [],
    connection,
    _fetch: mockFetch,
  }
  )();
  t.ok(packages, 'Search should not fail');
  t.equals(packages.length, 60, 'Right amount of packages');
  t.end();
});

test('Test recursive package fetching', async (t) => {
  const mockFetch = stub()
    .onCall(0).returns(Promise.resolve({
      json: () => Promise.resolve({
          total: 560,
          objects: new Array(250).fill({}),
        }
      ),
    }))
    .onCall(1).returns(Promise.resolve({
      json: () => Promise.resolve({
          total: 560,
          objects: new Array(250).fill({}),
        }
      ),
    }))
    .onCall(2).returns(Promise.resolve({
      json: () => Promise.resolve({
          total: 560,
          objects: new Array(60).fill({}),
        }
      ),
    }));

  const res = await get('', 250, 0, mockFetch, []);
  t.assert(res, 'Return valid array');
  t.equals(res.length, 560, 'Retrieves expected number of packages');
  t.end();
});
