const random = require("random");

/*

+ Assumptions +

- Can only make one cone at a time
- Customers must wait in line after arriving if a cone is in progress

*/

// STEPH FIX timeWindowHours = 7 PER PROBLEM STATMENT
const timeWindowHours = 7; // How many hours until VIP Customer shows up
const timeWindowMins = timeWindowHours * 60;

const coneTimeStats = {
    mean: 7, // (minutes) avg to create single cone
    stdDev: 1 // (minutes) std deviation
};

const calculateConeTime = random.normal(coneTimeStats.mean, coneTimeStats.stdDev);

const customerArrivalStats = {
    mean: 7, // (minutes) avg time between customer arrivals
};

const customerLambda = 1 / customerArrivalStats.mean;

const calcTimeBetweenCustomers = random.exponential(customerLambda);

const simulationIterations = 1001;
const waitTimesArray = [];

for (let i = 0; i < simulationIterations; i++) {

  // debugger;

  const customerQueue = [];

  const customerArrives = (arrivalTime) => {
    const cone = calculateConeTime(); // REMOVE Math.round() STEPH!!!!!
    const customer = {
      arrivalTime: arrivalTime,
      coneTime: cone,
      earliestLeaveTime: arrivalTime + cone
    };
    customerQueue.push(customer);
  }

  for (let time = 0; time < timeWindowMins;) {
    const timeTillNextCustomer = calcTimeBetweenCustomers(); // REMOVE Math.round() STEPH!!!!!
    const arrivalTime = time + timeTillNextCustomer;

    if (arrivalTime < timeWindowMins) {
      time = arrivalTime;
      customerArrives(arrivalTime);
    } else {
      time = timeWindowMins;
    }
  }

  // console.log(customerQueue);
  // debugger; // STEPH

  customerQueue[0].leaveTime = customerQueue[0].earliestLeaveTime;

  for (let i = 1; i < (customerQueue.length); i++) {
    customerQueue[i].waitTime = customerQueue[i-1].leaveTime - customerQueue[i].arrivalTime;
    if (customerQueue[i].waitTime < 0) {
      customerQueue[i].waitTime = 0;
    }
    customerQueue[i].leaveTime = customerQueue[i].waitTime + customerQueue[i].earliestLeaveTime;
  }

  const VIPCustomer = {
    arrivalTime: timeWindowMins
  };
  VIPCustomer.waitTime = customerQueue[customerQueue.length - 1].leaveTime - VIPCustomer.arrivalTime;
  if (VIPCustomer.waitTime < 0) {
    VIPCustomer.waitTime = 0;
  }

  // console.log(customerQueue);
  // console.log('');
  // console.log(customerQueue[customerQueue.length - 1])
  // console.log('');
  console.log('i: ' + i + ' Wait Time: ' + VIPCustomer.waitTime);
  waitTimesArray.push(VIPCustomer.waitTime);
  // debugger; // STEPH


  /*
  let average = (array) => array.reduce((a, b) => a + b) / array.length;
  console.log(average([1,2,3,4]));
  */
}

console.log(waitTimesArray);


const arrayAverage = (array) => array.reduce((a, b) => a + b) / array.length;

console.log('Average: ' + arrayAverage(waitTimesArray));

debugger;
