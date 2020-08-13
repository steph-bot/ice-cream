const simulationNormal = require('./simulation-normal');

/*

Cone making time is normally distributed, customer arrivals are exponentially distributed.

*/

simulationNormal(
  7, // timeWindowHrs
  7, // coneTimeMeanMins
  1, // coneTimeStdDevMins
  7, // custArrivalMeanMins
  1001, // simRuns
);
