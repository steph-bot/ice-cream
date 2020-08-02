const random = require("random");

const input = {
    timeWindow_i: 7, // hours until VIP customer arrives
    coneTimeMeanMins: 7,   // avg time to create single cone
    coneTimeStdDevMins: 1,  // std deviation
    customerArrivalMeanMins: 7, // avg time b/w customer arrivals
    simulationRuns: 1001 // how many simulation iterations

}

const timeWindow_i = {};
timeWindow_i.hours = input.timeWindow_i;
timeWindow_i.mins = timeWindow_i.hours * 60;

const coneTimeStats = {
    mean: input.coneTimeMeanMins,
    stdDev: input.coneTimeStdDevMins
};

const calculateConeTime_i = random.normal(coneTimeStats.mean, coneTimeStats.stdDev);

const customerArrivalStats = {};
customerArrivalStats.mean = input.customerArrivalMeanMins;
customerArrivalStats.lambda = 1 / customerArrivalStats.mean;

const calcTimeBetweenCustomers = random.exponential(customerArrivalStats.lambda);

const simulationIterations = 1001;

module.exports = {
    timeWindow_i,
    calculateConeTime_i,
    calcTimeBetweenCustomers,
    simulationIterations
}