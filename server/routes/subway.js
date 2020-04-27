const express = require('express');

const subwayController = require('../controllers/subwayController');

const router = express.Router();

router.get('/', subwayController.getSchedule, (req, res) => {
  res.status(200).json({ schedule: res.locals.schedule });
});

router.get('/astoria-blvd', subwayController.getScheduleAstoria, (req, res) => {
  res.status(200).json({ schedule: res.locals.schedule });
});

module.exports = router;
