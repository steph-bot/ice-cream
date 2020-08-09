const random = require('random');
const simulation = require('./simulation');

const simulationNormal = (
  timeWindowHrs,
  coneTimeMeanMins,
  coneTimeStdDevMins,
  custArrivalMeanMins,
  simRuns,
) => {
  console.log('\n- - - - - i n p u t - - - - - -');
  console.log(`timeWindowHrs: ${timeWindowHrs}`);
  console.log(`coneTimeMeanMins: ${coneTimeMeanMins}`);
  console.log(`coneTimeStdDevMins: ${coneTimeStdDevMins}`);
  console.log(`custArrivalMeanMins: ${custArrivalMeanMins}`);
  console.log(`simRuns: ${simRuns}`);

  const timeWindow = {};
  timeWindow.hours = Number(timeWindowHrs);
  timeWindow.mins = timeWindow.hours * 60;

  const calculateConeTime = random.normal(Number(coneTimeMeanMins), Number(coneTimeStdDevMins));

  const customerArrivalLambda = 1 / custArrivalMeanMins;
  const calcTimeBetweenCustomers = random.exponential(customerArrivalLambda);

  const output = simulation(
    timeWindow,
    simRuns,
    calculateConeTime,
    calcTimeBetweenCustomers,
  );
  return output.simSummary;
};

module.exports = simulationNormal;
