const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'd990c8a9559d42fdb1e01deaff01ba7e', // only needed for mta.schedule() method
  // feed_id: 16                  // optional, default = 1
});
const fetch = require('node-fetch')
const scheduleController = {};

scheduleController.getSchedule = (req, res, next) => {
    const { stationId, feedId } = req.params;
    const promises = [];
    promises.push(mta.schedule(stationId, feedId)
        .then(function (result) {
            try {
                res.locals.stationId = stationId;
                res.locals.feedId = feedId;
                res.locals.schedule = { ...result.schedule[stationId] };
            }
            catch(e) {
                next({
                    log: `scheduleController.getSchedule ERROR: ${e}`,
                    message: { err: 'scheduleController.getSchedule ERROR: Check server logs for details' },
                })
            }
    }));
    promises.push(mta.stop(stationId)
        .then(function (result) {
            try {
                res.locals.stopName = result.stop_name;
            }
            catch(e) {
                next({
                    log: `scheduleController.getSchedule ERROR: ${e}`,
                    message: { err: 'scheduleController.getSchedule ERROR: Check server logs for details' },
                })
            }
    }));
    Promise.all(promises)
        .then(()=>next());
        
}

module.exports = scheduleController;
