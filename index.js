const {init} = require('./server');

init().then((server) => {
  server.log(['info'], 'Starting server...');
  return server.start().then(() => {
    server.log(['info'], `BioJS Workman Server started in ${server.info.uri}.`);
  });
}).catch((err) => {
  console.error(err);
});
