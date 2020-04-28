const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/:id', fileController.getRoutes, fileController.getStations, fileController.searchStations, (req, res) => {
  res.status(200).json({ searchResults: res.locals.searchResults })
})

module.exports = router;
