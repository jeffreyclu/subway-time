require('dotenv').config();
const express = require('express');
const app = new express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const searchRouter = require('./routes/search');
const scheduleRouter = require('./routes/schedule');

app.use(express.static(path.join(__dirname, '../client/')));

app.use('/search', searchRouter);
app.use('/get', scheduleRouter);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/search.html'));
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