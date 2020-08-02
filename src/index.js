const { 
  timeWindow_i, 
  calculateConeTime_i, 
  calcTimeBetweenCustomers,
  simulationIterations } = require("./consts");
// < Average: 41.89834305234547
// < programRunTime: 42.188ms

/*

+ Assumptions +

- Can only make one cone at a time
- Customers must wait in line after arriving if a cone is in progress

*/

console.time('programRunTime');

const customerArrives = (arrivalTime, customerArray, calculateConeTime) => {
  const coneTime = calculateConeTime();
  const customer = {
    arrivalTime: arrivalTime,
    coneTime: coneTime,
    earliestLeaveTime: arrivalTime + coneTime
  };
  customerArray.push(customer);
}

const customerCalcs = (customerArray) => {
  const i = customerArray.length - 1;
  if (i === 0) {
    // 1st Customer
    customerArray[0].leaveTime = customerArray[0].earliestLeaveTime;
    customerArray[0].waitTime = 0;
    customerArray[0].systemWaitTime = customerArray[0].waitTime + customerArray[0].coneTime;
  } else {
    // Subsequent Customers
    customerArray[i].waitTime = customerArray[i - 1].leaveTime - customerArray[i].arrivalTime;
    if (customerArray[i].waitTime < 0) {
      customerArray[i].waitTime = 0;
    }
    customerArray[i].leaveTime = customerArray[i].waitTime + customerArray[i].earliestLeaveTime;
    customerArray[i].systemWaitTime = customerArray[i].waitTime + customerArray[i].coneTime;
  }
}

const simulation = (
  timeWindow,
  simRuns,
  calculateConeTime,
  calcTimeBetweenCustomers
  ) => {
  const waitTimesArray = [];
  for (let i = 0; i < simRuns; i++) {
    const customerQueue = [];
    for (let time = 0; time < timeWindow.mins;) {
      const timeTillNextCustomer = calcTimeBetweenCustomers();
      const arrivalTime = time + timeTillNextCustomer;

      if (arrivalTime < timeWindow.mins) {
        time = arrivalTime;
        customerArrives(arrivalTime, customerQueue, calculateConeTime);
        customerCalcs(customerQueue);
      } else {
        time = timeWindow.mins;
      }
    }

    const VIPCustomer = {
      arrivalTime: timeWindow.mins
    };
    VIPCustomer.waitTime = customerQueue[customerQueue.length - 1].leaveTime - VIPCustomer.arrivalTime;
    if (VIPCustomer.waitTime < 0) {
      VIPCustomer.waitTime = 0;
    }

    waitTimesArray.push(VIPCustomer.waitTime);
  }
  return waitTimesArray;
}

const waitTimesArray = simulation(
  timeWindow_i,
  simulationIterations,
  calculateConeTime_i,
  calcTimeBetweenCustomers
  );

const arrayAverage = (array) => array.reduce((a, b) => a + b) / array.length;

console.log('Average: ' + arrayAverage(waitTimesArray));

console.timeEnd('programRunTime');

module.exports = simulation;