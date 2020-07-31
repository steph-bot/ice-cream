const random = require("random");

// STEPH FIX TIMEWINDOWHOURS = 7 PER PROBLEM STATMENT
const timeWindowHours = 7; // How many hours until VIP Customer shows up
const timeWindowMins = timeWindowHours * 60;

const coneTimeStats = {
    mean: 7, // (minutes) avg to create single cone
    stdDev: 1 // (minutes) std deviation
};

// STEPH REMOVE MATH.ROUND!
const calculateConeTime = random.normal(coneTimeStats.mean, coneTimeStats.stdDev);

const customerArrivalStats = {
    mean: 7, // (minutes) avg time between customer arrivals
};

const lambda = 1 / customerArrivalStats.mean;

// STEPH REMOVE MATH.ROUND!
const calcTimeBetweenCustomers = random.exponential(lambda);

const simulationIterations = 1001;

let currentTimeMins = 0;
const customerQueue = [];

const customerArrives = (arrivalTime) => {
  const cone = Math.round(calculateConeTime()); // REMOVE MATH ROUND STEPH!!!!!
  const customer = {
    arrivalTime: arrivalTime,
    coneTime: cone,
    earliestLeaveTime: arrivalTime + cone
  };
  customerQueue.push(customer);
}

for (let time = 0; time < timeWindowMins;) {
  console.log('Start time: ' + time);

  const timeTillNextCustomer = Math.round(calcTimeBetweenCustomers()); // REMOVE MATH ROUND STEPH!!!!!

  console.log('Time till next cust: ' + timeTillNextCustomer)

  const arrivalTime = time + timeTillNextCustomer;

  if (arrivalTime < timeWindowMins) {
    time = arrivalTime;
    customerArrives(arrivalTime);
  } else {
    time = timeWindowMins;
  }

  console.log('Current time: ' + time);
  console.log(customerQueue)
}


debugger; //STEPH STPHE TPHSEPAHSOIJDA;SDJ;AJS;I
for (let i = 0; i < (customerQueue.length-1); i++) {
  //
  customerQueue[i].leaveTime = (customerQueue[i].waitTime || 0) + customerQueue[i].earliestLeaveTime;
  customerQueue[i + 1].waitTime = customerQueue[i].leaveTime - customerQueue[i + 1].arrivalTime;

  if (customerQueue[i + 1].waitTime < 0) {
    customerQueue[i + 1].waitTime = 0;
  }

  console.log(customerQueue);
  // debugger;


}



  // Customer arrives
  // Customer orders cone
  // Cone is complete



/*
Assumptions:
- Can only make one cone at a time
- Customers must wait in line after arriving if a cone is in progress
*/


debugger;


/*
let average = (array) => array.reduce((a, b) => a + b) / array.length;
console.log(average([1,2,3,4]));
*/
