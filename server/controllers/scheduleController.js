const Mta = require('mta-gtfs-jl');

const mta = new Mta({
  key: process.env.MTA_API_KEY
});

const scheduleController = {};

scheduleController.getSchedule = (req, res, next) => {
  const { stationId, feedId } = req.params;
  const promises = [];
  let queryFeedId = feedId;
  if (feedId === '-123456') queryFeedId = undefined;
  promises.push(mta.schedule(stationId, queryFeedId)
    .then((result) => {
      try {
        res.locals.stationId = stationId;
        res.locals.feedId = feedId;
        res.locals.schedule = { ...result.schedule[stationId] };
      } catch (e) {
        next({
          log: `scheduleController.getSchedule ERROR: ${e}`,
          message: { err: 'scheduleController.getSchedule ERROR: Check server logs for details' },
        });
      }
    }));
  promises.push(mta.stop(stationId)
    .then((result) => {
      try {
        res.locals.stopName = result.stop_name;
      } catch (e) {
        next({
          log: `scheduleController.getSchedule ERROR: ${e}`,
          message: { err: 'scheduleController.getSchedule ERROR: Check server logs for details' },
        });
      }
    }));
  Promise.all(promises)
    .then(() => next());
};

module.exports = scheduleController;
