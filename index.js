const {init} = require('./server');

init({}).then((server) => {
  console.log('Starting server...');
  return server.start().then(() => {
    console.log(`BioJS Workman Server started in ${server.info.uri}.`);
  });
}).catch((err) => {
  console.error(err);
});
