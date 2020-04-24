const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'd990c8a9559d42fdb1e01deaff01ba7e', // only needed for mta.schedule() method
  // feed_id: 16                  // optional, default = 1
});
const subwayController = {};

subwayController.getSchedule = (req, res, next) => {

    mta.schedule('R30', 16).then(function (result) {
        try {
            res.locals.schedule = { ...result.schedule['R30'] };
            next();
        }
        catch(e) {
            next({
                log: `subwayController.getSchedule ERROR: ${e}`,
                message: { err: 'subwayController.getSchedule ERROR: Check server logs for details' },
            })
        }
    });
}

module.exports = subwayController;
