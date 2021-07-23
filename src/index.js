
// ---- VARIABLES ---- //

// VALUE VARIABLES
//the last sequence of number values (int or float value)
let currentNumber = '';
let currentDisplayNumber = '';

//the current number formatted for display
let currentSequence = ''; 

//the full input sequence for display
let fullSequence = '';

//the calculated value
let currentValue = 0;

//listener variables
let numberButtons = document.querySelectorAll('.button-number');

//display variables
let outputDisplay = document.querySelector('#output-display');
let inputDisplay = document.querySelector('#input-display');

//RegEx variables to test input
//RegEx for a decimal character
const decRegex = new RegExp(/\./);

// ---- end variables ----//


// ---- FUNCTIONS ---- //

//receives input and updates the input variables
updateCurrentDisplayNumber = (input) => {
  currentDisplayNumber = input;
  outputDisplay.innerText = currentDisplayNumber;
};

updateCurrentNumber = (value) => {
  currentNumber += value;
}

toggleNumberButtons = () => {
  numberButtons.forEach(button => {
    ((button.disabled) ? (button.disabled = false) : (button.disabled = true));
      });
};

checkInputLength = (curNumLen) => {
  if (curNumLen === 9 && !decRegex.test(currentNumber)){
    console.log('She can nae take any more, Captain!');
    toggleNumberButtons();
  }
  if (curNumLen === 10 && decRegex.test(currentNumber)){
    console.log('decimal, check!');
    console.log('She can nae take any more, Captain!');
    toggleNumberButtons();
  } 
};

handleNumber = (input) => {
  //count the number of digits in the current sequence
  let value = input;
  updateCurrentNumber(value);
  let curNumLen = currentNumber.length;
  checkInputLength(curNumLen);
  let joinedNumber = '';
  console.log(decRegex.test(currentNumber));
  //if the current input doesn't have a decimal, add commas for the thousands and millions place
  if (currentNumber && !decRegex.test(currentNumber) && (currentNumber.length > 3 && currentNumber.length <= 6)){
    // Split the current sequence and add a comma in the thousands position
    let splitNumber = currentNumber.split('');
    splitNumber.splice((curNumLen-3), 0, ',');
    joinedNumber = splitNumber.join('');
    updateCurrentDisplayNumber(joinedNumber);
    return;
  };
  if (currentNumber && !decRegex.test(currentNumber) && (currentNumber.length > 6 && currentNumber.length <= 9)){
    // Split and add commas in in the thousands and millions position
    let splitNumber = currentNumber.split('');
    // Insert the string at the index position
    splitNumber.splice((curNumLen-3), 0, ',');
    splitNumber.splice((curNumLen-6), 0, ',');
    // Join back the individual characters
    joinedNumber = splitNumber.join('');
    updateCurrentDisplayNumber(joinedNumber);
    return;
  };
  //send the values to display & input functions
  updateCurrentDisplayNumber(currentNumber);
  //limits the input to nine numerals
};

//checks the input for appropriate handling
processInput = (input) => {
  if(parseInt(input)) {
    handleNumber(input);
  }
    // if (input === '.') {
    //   //toggle the event listener for the decimal
    //   // updateCurrentInpubt will then add the decimal to the input string
    //   console.log('add decimal, turn off decimal listener');
    // }
};
// ---- end functions ---- //

// ---- LISTENERS AND CALLS ---- //
// adds event listeners for digits and decimal and passes input value to checkInput
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    let input = button.getAttribute('data-input');
    processInput(input);
  },)
});

// ---- end listeners and calls ---- //