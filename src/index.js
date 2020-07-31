const random = require("random");

const timeWindowHours = 7; // How many hours until VIP Customer shows up
const timeWindowMins = timeWindowHours * 60;
debugger;

const coneTimeStats = {
    mean: 7, // (minutes) avg to create single cone
    stdDev: 1 // (minutes) std deviation
};

const calculateConeTime = random.normal(coneTimeStats.mean, coneTimeStats.stdDev);

const customerArrivalStats = {
    mean: 7, // (minutes) avg time between customer arrivals
};

const lambda = 1 / customerArrivalStats.mean;

const calcTimeBetweenCustomers = random.exponential(lambda);

const simulationIterations = 1001;
/*
console.log(calculateConeTime());
console.log(calculateConeTime());
console.log(calculateConeTime());

debugger;

console.log(calcTimeBetweenCustomers());
console.log(calcTimeBetweenCustomers());
console.log(calcTimeBetweenCustomers());
*/

let currentTimeMins = 0;

if (currentTimeMins < timeWindowMins) {
  const customerQueue = [];

  const customerArrives = (currentTime) => {
      const customer = {
          arrivalTime: currentTime + calcTimeBetweenCustomers(),
          coneTime: calculateConeTime()
      };

    }

  customerArrives(currentTimeMins);

    // Customer arrives
    // Customer orders cone
    const timeTillConeComplete = calculateConeTime();
    // Cone is complete
    currentTimeMins = currentTimeMins + timeTillConeComplete;


}

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
