const {extractOwner} = require('./github');
const {test} = require('tape');

const urls = [
  'git+https://github.com/afrivera/cytoscape.js.git',
  'https://github.com/jmvillaveces/biojs-vis-psicquic.git',
  'git://github.com/mandarsd/pdb-redo.git',
];

const results = {
  'git+https://github.com/afrivera/cytoscape.js.git': {
    owner: 'afrivera',
    repo: 'cytoscape.js',
  },
  'https://github.com/jmvillaveces/biojs-vis-psicquic.git': {
    owner: 'jmvillaveces',
    repo: 'biojs-vis-psicquic',
  },
  'git://github.com/mandarsd/pdb-redo.git': {
    owner: 'mandarsd',
    repo: 'pdb-redo',
  },
};

test('Extraction of info from github url', (t) => {
  t.plan(urls.length);
  urls.map((url) => {
    t.deepEqual(extractOwner(url), results[url]);
  });
});
