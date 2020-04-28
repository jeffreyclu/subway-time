const express = require('express');

const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.get('/:stationId/:feedId', scheduleController.getSchedule, (req, res) => {
  res.status(200).json({ schedule: res.locals.schedule, stopName: res.locals.stopName, route: res.locals.route });
});

module.exports = router;
