const {get} = require('./npm');
const {test} = require('tape');
const {stub} = require('sinon');

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
