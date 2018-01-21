const {updateDb} = require('./database');

/**
 * Update db in regular intervals
 * @param {Object} payload Settings needed for db update
 */
function update(payload) {
  const interval = payload.interval || 3600000;
  /**
   * Function calling the db update
   */
  function cron() {
    console.log(`Updating db - ${new Date()}`);
    updateDb(payload)()
    .then((res) => console.log('sucess!'))
    .catch((err) => console.error(err));
  }
  setInterval(cron, interval);
}

module.exports = {
  update,
};
