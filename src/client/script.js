// issues to work out:
//
// - allows for submission with missing digits. leads to inaccurate results!
//	 esp after a full number has been submitted, followed by an incomplete
//
// - fix focus() situation

// const simulation = require('../lib/simulation');

/* ---------------------------------------------------------------------------*\
  # CACHE SELECTORS
\*---------------------------------------------------------------------------*/

// const input.timeWindow = document.getElementsByName('timeWindow')[0]; // user entry digit #1
// const input.coneTimeMeanMins = document.getElementsByName('coneTimeMeanMins')[0]; //				   #2
// const input.coneTimeStdDevMins = document.getElementsByName('coneTimeStdDevMins')[0]; //				   #3
// const input.customerArrivalMeanMins = document.getElementsByName('customerArrivalMeanMins')[0]; //				   #4
// const input.simulationRuns = document.getElementsByName('simulationRuns')[0]; //				   #5
// const digit6a = document.getElementsByName('digit6')[0]; //				   #6
// const digit7a = document.getElementsByName('digit7')[0]; //				   #7

const input = {
  timeWindow: document.getElementsByName('timeWindow')[0], // hours until VIP customer arrives
  coneTimeMeanMins: document.getElementsByName('coneTimeMeanMins')[0], // avg time to create single cone
  coneTimeStdDevMins: document.getElementsByName('coneTimeStdDevMins')[0], // std deviation
  customerArrivalMeanMins: document.getElementsByName('customerArrivalMeanMins')[0], // avg time b/w customer arrivals
  simulationRuns: document.getElementsByName('simulationRuns')[0], // how many simulation iterations
};

let userEntry; // user entered phone number as a string ex: "3308004"

const button = document.getElementById('btn'); // submit button
const clearBtn = document.getElementById('clearBtn'); // clear button
const ul = document.querySelectorAll('ul')[1]; // select unordered list

// define letters for each digit
const _0 = ['0'];
const _1 = ['1'];
const _2 = ['a', 'b', 'c'];
const _3 = ['d', 'e', 'f'];
const _4 = ['g', 'h', 'i'];
const _5 = ['j', 'k', 'l'];
const _6 = ['m', 'n', 'o'];
const _7 = ['p', 'q', 'r', 's'];
const _8 = ['t', 'u', 'v'];
const _9 = ['w', 'x', 'y', 'z'];

const newUserArray2 = []; // phone number array
// ex: ["_3", "_3", "_0", "_8", "_0", "_0", "_4"]

const newUserArray = []; // phone number [array of [array of letters]]
let letterMatrix = []; // phone number array of letters

let list = []; // array of all letter combos

// FUNCTION DECLARATION
// form validation for numbers
// allows numbers only to be entered into form
function isNumber(evt) {
  evt = (evt) || window.event;
  const charCode = (evt.which) ? evt.which : evt.keyCode;
  
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  console.log(charCode);
  return true;

}



// FUNCTION DECLARATION
// moves cursor to input box
function cursor() {
  document.getElementsByName('timeWindow')[0].select();
  document.getElementsByName('timeWindow')[0].focus({ preventScroll: true });
}

// FUNCTION DECLARATION
// name is what we are looking at (ex: userEntry = '234')
// function will create newUserArray2 with format: ['_2', '_3', '_4']
function createArray2(name) {
  counter2 = 0;
  while (counter2 < name.length) {
    newUserArray2[counter2] = `_${name[counter2]}`;
    // console.log(newUserArray2[counter2]);
    counter2++;
  }
}

// FUNCTION DECLARATION
// creates new array with letters for each number (newUserArray)
function numToLetters(name) {
  i = 0;
  while (i < name.length) {
    if (name[i] === '_0') {
      newUserArray[i] = [_0];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_1') {
      newUserArray[i] = [_1];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_2') {
      newUserArray[i] = [_2];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_3') {
      newUserArray[i] = [_3];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_4') {
      newUserArray[i] = [_4];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_5') {
      newUserArray[i] = [_5];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_6') {
      newUserArray[i] = [_6];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_7') {
      newUserArray[i] = [_7];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_8') {
      newUserArray[i] = [_8];
      // console.log(newUserArray);
      i++;
    } else if (name[i] === '_9') {
      newUserArray[i] = [_9];
      // console.log(newUserArray);
      i++;
    } else {
      newUserArray[i] = [_0];
      // console.log(newUserArray);
      i++;
    }
  }
}

// FUNCTION DECLARATION
function simplifyArray(name) {
  const simpleArray = [];
  i = 0;
  while (i < name.length) {
    simpleArray[i] = name[i][0];
    // console.log(simpleArray);
    i++;
  }
  return simpleArray;
}

// FUNCTION DECLARATION
// function will create list=[] of all letters combos for phone number
// - - - - - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - -
// name1 is which digit we are looking at (ex: 2)
// input is each item of letterMatrix array (created from phone number)
// output is list of all letters combos for phone number
function letterList(name1, name2, name3, name4, name5, name6, name7) {
  list = [];
  list.push(name1);
  list.push(name2);
  list.push(name3);
  list.push(name4);
  list.push(name5);
  // counter1 = 0;
  // counter2 = 0;
  // counter3 = 0;
  // counter4 = 0;
  // counter5 = 0;
  // counter6 = 0;
  // counter7 = 0;
  // // while (counter7 < name7.length) {
  //   while (counter6 < name6.length) {
  //     while (counter5 < name5.length) {
  //       while (counter4 < name4.length) {
  //         while (counter3 < name3.length) {
  //           while (counter2 < name2.length) {
  //             while (counter1 < name1.length) {
  //               // console.log(name1[counter1]+name2[counter2]+name3[counter3]+name4[counter4]+name5[counter5]+name6[counter6]+name7[counter7]);
  //               list.push(name1[counter1] + name2[counter2] + name3[counter3] + name4[counter4] + name5[counter5] + name6[counter6] + name7[counter7]);
  //               counter1++;
  //             }
  //             counter2++;
  //             counter1 = 0;
  //           }
  //           counter3++;
  //           counter2 = 0;
  //           counter1 = 0;
  //         }
  //         counter4++;
  //         counter3 = 0;
  //         counter2 = 0;
  //         counter1 = 0;
  //       }
  //       counter5++;
  //       counter4 = 0;
  //       counter3 = 0;
  //       counter2 = 0;
  //       counter1 = 0;
  //     }
  //     counter6++;
  //     counter5 = 0;
  //     counter4 = 0;
  //     counter3 = 0;
  //     counter2 = 0;
  //     counter1 = 0;
  //   }
  //   counter7++;
  //   counter6 = 0;
  //   counter5 = 0;
  //   counter4 = 0;
  //   counter3 = 0;
  //   counter2 = 0;
  //   counter1 = 0;
  // // } //
}

// wip wip wip

// creates new list item and appends to bottom of list
function createListElement() {
  // create list element
  var li = document.createElement('li');

  // add text to list element (user input)
  li.appendChild(document.createTextNode(`${list.length} entries`));

  li.classList.add('entryCounter'); // add class to list item

  // append li to unordered list
  ul.appendChild(li);

  i = 0;
  while (i < list.length) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(list[i]));
    li.classList.add('listItem'); // add class to list item
    ul.appendChild(li);
    i++;
  }
}

// clear list of combos
function clearList() {
  let listItemToDel = document.getElementsByClassName('listItem');
  while (listItemToDel[0]) {
    listItemToDel[0].parentNode.removeChild(listItemToDel[0]);
  }

  listItemToDel = document.getElementsByClassName('entryCounter');
  while (listItemToDel[0]) {
    listItemToDel[0].parentNode.removeChild(listItemToDel[0]);
  }
}

// reset form to blank value
function clearForm() {
  clearList();
  input.timeWindow.value = '';
  input.coneTimeMeanMins.value = '';
  input.coneTimeStdDevMins.value = '';
  input.customerArrivalMeanMins.value = '';
  input.simulationRuns.value = '';
  // digit6a.value = '';
  // digit7a.value = '';
  cursor();
}

// FUNCTION DECLARATION
// when form submits, create list of letter combos from user entry
function formSubmit() {
  clearList();

  userEntry = input.timeWindow.value + input.coneTimeMeanMins.value + input.coneTimeStdDevMins.value
        + input.customerArrivalMeanMins.value + input.simulationRuns.value

  // FUNCTION CALLS:
  createArray2(userEntry); // new array is newUserArray2
  numToLetters(newUserArray2); // new array is newUserArray

  letterMatrix = simplifyArray(newUserArray);

  letterList(letterMatrix[0], letterMatrix[1], letterMatrix[2],
    letterMatrix[3], letterMatrix[4], letterMatrix[5], letterMatrix[6]);

  console.log(list);

  createListElement();

  // cursor();
}

// FUNCTION CALL
// click submit button
button.addEventListener('click', formSubmit);
clearBtn.addEventListener('click', clearForm);

// newUserArray.length;

// FUNCTION DECLARATION
// counts number of vowels in a string and returns it
function getVowels(str) {
  const m = str.match(/[aeiou]/gi);
  return m === null ? 0 : m.length;
}

// FUNCTION DECLARATION
// ugh
function isBigEnough(value) {
  return (getVowels(value) > 0);
}

// FUNCTION CALL
const filtered = list.filter(isBigEnough);

console.log(filtered);

cursor();
