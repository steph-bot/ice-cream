const { performance } = require('perf_hooks');
const _ = require('lodash');
const quickSelect = require('quickselect.js');

// Calculate Average: Array of Numbers
const arrayAverage = (array) => array.reduce((a, b) => a + b, 0) / array.length;

// Calculate Median: Array of Numbers using Quickselect Algorithm
const quickSelectMedian = (array) => {
  const { length } = array;
  if (length % 2) {
    return quickSelect(array, length / 2);
  }
  return (
    0.5 * (quickSelect(array, length / 2 - 1) + quickSelect(array, length / 2))
  );
};

// Customer Arrives During Time Window
const customerArrives = (arrivalTime, customerInputArray, calculateConeTime) => {
  const customerArray = customerInputArray;
  const coneTime = calculateConeTime();
  const customer = {
    arrivalTime,
    coneTime,
    earliestLeaveTime: arrivalTime + coneTime,
  };
  customerArray.push(customer);
  return customerArray;
};

// Calculations for Customer in Queue
const customerCalcs = (customerInputArray) => {
  const customerArray = customerInputArray;
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
  return customerArray;
};

// Simulation Logic
const simulation = (
  timeWindow,
  simulationRuns,
  calculateConeTime,
  calcTimeBetweenCustomers,
) => {
  const programStartTime = performance.now();
  const VIPWaitTimesArray = [];
  const meanWaitInSystemArray = [];
  const meanWaitInQueueArray = [];
  for (let i = 0; i < simulationRuns; i++) {
    let customerQueue = [];

    // Customers Arrive During Time Window
    for (let time = 0; time < timeWindow.mins;) {
      const timeTillNextCustomer = calcTimeBetweenCustomers();
      const arrivalTime = time + timeTillNextCustomer;
      if (arrivalTime < timeWindow.mins) {
        time = arrivalTime;
        customerQueue = customerArrives(arrivalTime, customerQueue, calculateConeTime);
        customerQueue = customerCalcs(customerQueue);
      } else {
        time = timeWindow.mins; // Late Arrival
      }
    }

    // VIP Customer Arrives (End of Time Window)
    const VIPCustomer = {};
    VIPCustomer.arrivalTime = timeWindow.mins;
    const lastCustomerLeaveTime = _.get(
      customerQueue[customerQueue.length - 1], 'leaveTime', 0,
    );
    VIPCustomer.waitTime = lastCustomerLeaveTime - VIPCustomer.arrivalTime;
    if (VIPCustomer.waitTime < 0) {
      VIPCustomer.waitTime = 0;
    }
    VIPWaitTimesArray.push(VIPCustomer.waitTime);

    // Additional Data for Tests.
    if (process.env.NODE_ENV === 'development') {
      const allCustomerSystemWaitTimesArray = customerQueue.reduce((acc, customer, index) => {
        acc[index] = customer.systemWaitTime;
        return acc;
      }, [0]);
      const allCustomerQueueWaitTimesArray = customerQueue.reduce((acc, customer, index) => {
        acc[index] = customer.waitTime;
        return acc;
      }, [0]);
      const meanWaitInSystem = arrayAverage(allCustomerSystemWaitTimesArray);
      const meanWaitInQueue = arrayAverage(allCustomerQueueWaitTimesArray);
      meanWaitInSystemArray.push(meanWaitInSystem);
      meanWaitInQueueArray.push(meanWaitInQueue);
    }
  }

  const simOutput = {
    rawData: {
      waitTimeForVIP: VIPWaitTimesArray,
      meanWaitTimeForAllCustomers: {
        system: meanWaitInSystemArray,
        queue: meanWaitInQueueArray,
      },
    },
    simSummary: {
      meanWaitTimeForVIP: arrayAverage(VIPWaitTimesArray), // avg wait for VIP customer
      medianWaitTimeForVIP: Math.round(
        (quickSelectMedian(VIPWaitTimesArray) * 100),
      ) / 100, // median wait for VIP customer
      meanMeanWaitTimeForAllCustomers: {
        system: arrayAverage(meanWaitInSystemArray),
        queue: arrayAverage(meanWaitInQueueArray),
      },
    },
  };
  console.log('- - - - - r e s u l t - - - - - -\n');
  console.log(`Average Wait for VIP Customer: ${simOutput.simSummary.meanWaitTimeForVIP}`);
  console.log(`Median Wait for VIP Customer: ${simOutput.simSummary.medianWaitTimeForVIP}`);
  if (process.env.NODE_ENV === 'development') {
    // Additional Data for Tests.
    console.log(`Mean Wait in System (wait in queue + service time): ${simOutput.simSummary.meanMeanWaitTimeForAllCustomers.system}`);
    console.log(`Mean Wait in Queue (wait in queue): ${simOutput.simSummary.meanMeanWaitTimeForAllCustomers.queue}`);
  }
  const programEndTime = performance.now();
  simOutput.simSummary.programRunTime = (programEndTime - programStartTime);
  console.log(`Program Run Time (ms): ${simOutput.simSummary.programRunTime}`);
  console.log('\n- - - - - - - - - - - - - - - - -');

  return simOutput;
};

module.exports = simulation;
