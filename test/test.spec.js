const assert = require('assert');
const random = require('random');
const simulation = require('../src/lib/simulation');

/*

Cone making time is exponentially distributed, customer arrivals are exponentially distributed.
Reference: http://web.mst.edu/~gosavia/queuing_formulas.pdf

*/

const coneTimeStats = {
  mean: 8, // Average Cone Time (min)
};

const coneLambda = 1 / coneTimeStats.mean;

const customerArrivalStats = {
  mean: 10, // Average Customer Arrival Spacing (min)
};

const customerLambda = 1 / customerArrivalStats.mean;

const input = {
  timeWindowHrs: 10000,
  simulationRuns: 500,
  calculateConeTime: random.exponential(coneLambda),
  calcTimeBetweenCustomers: random.exponential(customerLambda),
};

const expected = {
  meanWaitInQueue: 32,
  meanWaitInSystem: 40,
  maxRunTime: 13000,
};

const errorTolerance = 0.5;

const valueWithinErrorTolerance = (actualVal, expectedVal, tolerance) => {
  const valueBelowErrorTol = actualVal < (expectedVal + tolerance);
  const valueAboveErrorTol = actualVal > (expectedVal - tolerance);
  return valueBelowErrorTol && valueAboveErrorTol;
};

describe('Simulation Logic (Example)', () => {
  const simulationOutput = simulation(
    input.timeWindowHrs,
    input.simulationRuns,
    input.calculateConeTime,
    input.calcTimeBetweenCustomers,
  );
  const actual = simulationOutput.simSummary;
  const output = {
    meanWaitInQueue: actual.meanMeanWaitTimeForAllCustomers.queue,
    meanWaitInSystem: actual.meanMeanWaitTimeForAllCustomers.system,
    programRunTime: actual.programRunTime,
  };
  it(`Should have mean wait in queue (${output.meanWaitInQueue}) close to ${expected.meanWaitInQueue}.`, () => {
    const valueCheck = valueWithinErrorTolerance(
      output.meanWaitInQueue,
      expected.meanWaitInQueue,
      errorTolerance,
    );
    assert.deepStrictEqual(valueCheck, true);
  });
  it(`Should have mean wait in system (${output.meanWaitInSystem}) close to ${expected.meanWaitInSystem}.`, () => {
    const valueCheck = valueWithinErrorTolerance(
      output.meanWaitInSystem,
      expected.meanWaitInSystem,
      errorTolerance,
    );
    assert.deepStrictEqual(valueCheck, true);
  });
  it(`Program run time (${output.programRunTime}) less than ${expected.maxRunTime}.`, () => {
    const valueCheck = output.programRunTime < expected.maxRunTime;
    assert.deepStrictEqual(valueCheck, true);
  });
});
