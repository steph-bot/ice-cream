const express = require('express');
const bodyParser = require('body-parser'); // middleware to help Express read properties from request object
const simulationNormal = require('./src/lib/simulation-normal');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('src/public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Parse POST data as URL encoded data
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Parse POST data as JSON
app.use(bodyParser.json());

// Express Error handler
const errorHandler = (err, req, res) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.status(403).send({ title: 'Server responded with an error', message: err.message });
  } else if (err.request) {
    // The request was made but no response was received
    res.status(503).send({ title: 'Unable to communicate with server', message: err.message });
  } else {
    // Something happened in setting up the request that triggered an Error
    res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
  }
};

// Run Simulation
app.post('/api/simulate', async (req, res) => {
  // req.setTimeout(240000);
  try {
    const {
      timeWindow,
      coneTimeMean,
      coneTimeStdDevMins,
      custArrivalMeanMins,
      simRuns,
    } = req.body;
    const data = await simulationNormal(
      timeWindow,
      coneTimeMean,
      coneTimeStdDevMins,
      custArrivalMeanMins,
      simRuns,
    );
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/src/public/index.html`));

// Listen for HTTP requests on port 3000
const server = app.listen(port, () => {
  console.log('listening on %d', port);
  console.log(`http://localhost:${port}/`);
});

// server.setTimeout(240000);

// // Test Simulation Endpoint
// const test = async () => {
//     const data = await simulationNormal(
//         7, // timeWindowHrs,
//         7, // coneTimeMeanMins,
//         1, // coneTimeStdDevMins,
//         7, // custArrivalMeanMins,
//         1001, // simRuns,
//     );
//     console.log(data);
// }
// test();
