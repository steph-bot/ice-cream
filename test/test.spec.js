const assert = require('assert');
const random = require('random');
const simulation = require('../src/lib/simulation');

// Reference: http://web.mst.edu/~gosavia/queuing_formulas.pdf

const coneTimeStats = {
  mean: 8, // (minutes) avg time between customer arrivals
};

const coneLambda = 1 / coneTimeStats.mean;

const customerArrivalStats = {
  mean: 10, // (minutes) avg time between customer arrivals
};

const customerLambda = 1 / customerArrivalStats.mean;

const input = {
  timeWindow: {},
  simulationRuns: 500,
  calculateConeTime: random.exponential(coneLambda),
  calcTimeBetweenCustomers: random.exponential(customerLambda),
};

input.timeWindow.hours = 10000; // How many hours until VIP Customer shows up
input.timeWindow.mins = input.timeWindow.hours * 60;

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
    input.timeWindow,
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
