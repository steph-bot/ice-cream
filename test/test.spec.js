const assert = require('assert');
const random = require('random');
const simulation = require('../src/index');

const expectedInput = {};

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

describe('Sample unit test', () => {
  it('should run without errors.', () => {
    const expectedOutput = simulation(
      input.timeWindow,
      input.simulationRuns,
      input.calculateConeTime,
      input.calcTimeBetweenCustomers,
    );
    assert.deepStrictEqual(expectedInput, expectedOutput);
  });
});
