const random = require('random');
const simulation = require('./simulation');

const simulationNormal = (
  timeWindowHrs,
  coneTimeMeanMins,
  coneTimeStdDevMins,
  custArrivalMeanMins,
  simRuns,
) => {
  const timeWindow = {};
  timeWindow.hours = timeWindowHrs;
  timeWindow.mins = timeWindow.hours * 60;

  const calculateConeTime = random.normal(coneTimeMeanMins, coneTimeStdDevMins);

  const customerArrivalLambda = 1 / custArrivalMeanMins;
  const calcTimeBetweenCustomers = random.exponential(customerArrivalLambda);

  const output = simulation(
    timeWindow,
    simRuns,
    calculateConeTime,
    calcTimeBetweenCustomers,
  );

  return output;
};

module.exports = simulationNormal;
