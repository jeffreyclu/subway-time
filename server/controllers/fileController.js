const fs = require('fs');
const path = require('path');
const fileController = {};

fileController.getRoutes = (req, res, next) => {
  const routes = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/feeds.json")));
  if (!routes) {
    return next({
      log: 'fileController.getRoutes: ERROR: Error getting characters data from characters.json file',
      message: { err: 'Error occurred in fileController.getRoutes. Check server logs for more details.' },
    });
  }
  res.locals.routes = routes;
  next();
}

fileController.getStations = (req, res, next) => {
  const stations = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/stations.json")));
  if (!stations) {
    return next({
      log: 'fileController.getStations: ERROR: Error getting characters data from characters.json file',
      message: { err: 'Error occurred in fileController.getStations. Check server logs for more details.' },
    });
  }
  res.locals.stations = stations;
  next();
}

fileController.searchStations = (req, res, next) => {
    try {
        const searchId = req.params.id;
        let results = res.locals.stations.filter(station => JSON.stringify(station["Stop Name"]).toLowerCase().includes(searchId.toLowerCase()) && station["GTFS Stop ID"] !== 901 && station["GTFS Stop ID"] !== 902);
        results.forEach(result=>{
          const feeds = new Set();
          const searchRoute = JSON.stringify(result["GTFS Stop ID"]).replace(/("|')/g, "")[0];
          for (const [key, value] of Object.entries(res.locals.routes)) {
            let routes = JSON.stringify(value.join(""));
            if (routes.includes(searchRoute)) {
              feeds.add(key);
            };
          }
          //handles Sutphin Blvd - Archer Av - JFK Airport that has a weird route (E J Z lines)
          if (result["GTFS Stop ID"] === 'G06') {
            result["Feeds"] = ['36'];
          }
          //handles stations with B Q lines that require the 'NQRW' line feed instead of 'BDFM'
          else if (result["GTFS Stop ID"][0] === 'D' && result["Daytime Routes"] === 'B Q') {
            result["Feeds"] = ['16'];
          }
          //handles queens plaza station that has E M and R lines
          else if (result["Stop Name"] === "Queens Plaza") {
            result["Feeds"] = ['16', '21', '26'];
          }
          else {
            result["Feeds"] = Array.from(feeds);
          }
        })
        res.locals.searchResults = results;
        next();
    }
    catch (e) {
        next({
          log: `fileController.searchStation: ERROR: ${e}`,
          message: { err: 'fileController.searchStation: ERROR: Check server logs for details' },
        });
      }{
    }
}

module.exports = fileController;
