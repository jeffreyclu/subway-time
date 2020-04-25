const Mta = require('mta-gtfs');
const mta = new Mta({
  key: 'd990c8a9559d42fdb1e01deaff01ba7e', // only needed for mta.schedule() method
  // feed_id: 16                  // optional, default = 1
});

const fs = require('fs')
const express = require('express');
const app = new express();
const PORT = 3000;
const path = require('path')

const subwayRouter = require('./routes/subway');

app.use('/assets', express.static('../client/assets'));

app.use('/subway', subwayRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile('../client/index.html');
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;