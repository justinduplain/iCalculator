
// ---- VARIABLES ---- //

// VALUE VARIABLES
//the last sequence of number values (int or float value)
let currentInt = '0'
let currentDecimal = '';
let currentNumber = '0';
let currentDisplayInt = '';
//the current input sequence formatted for display
let currentDisplayNumber = '0';

//the full input sequence for display and evaluation
let fullSequence = '';

//the calculated value
let currentValue = 0;

//listener variables
let inputButtons = document.querySelectorAll('.button-input');
let functionButtons = document.querySelectorAll('.button-function');

//display variables
let outputDisplay = document.querySelector('#output-display');
let inputDisplay = document.querySelector('#input-display');

//RegEx variables to test input
//RegEx for a decimal character
const decRegex = new RegExp(/\./);

// ---- end variables ----//


// ---- FUNCTIONS ---- //

disableInputButtons = () => {
  inputButtons.forEach(button => {
    button.disabled = true});
};

disableDecimal = () => {
  document.querySelector('#decml').disabled = true;
}

toggleParens = () => {
  parenButton = document.querySelectorAll('.paren');
  parenButton.forEach(button => {
    button.disabled ? button.disabled = false :  button.disabled = true});
};

updateCurrentNumber = () => {
  currentNumber = currentInt + currentDecimal;
}

checkLength = () => {
  let numberLength = (currentNumber.replace(/\D/g,'')).length;
  if (numberLength >= 9 ){
    console.log('She can\'t take any more Captain!');
    inputDisplay.innerText = `She can't take any more, Captain!`;
    disableInputButtons();
  }
};

// checks number, handles commas and displays the number
displayNumber = () => {
  let joinedNumber;
  //if the current input doesn't have a decimal, add commas for the thousands and millions place
  if (currentInt && (currentInt.length > 3 && currentInt.length <= 6)){
    // Split the current sequence and add a comma in the thousands position
    let splitNumber = currentInt.split('');
    splitNumber.splice((currentInt.length-3), 0, ',');
    joinedNumber = splitNumber.join('');
  };
  if (currentInt && (currentInt.length > 6 && currentInt.length <= 9)){
    // Split and add commas in in the thousands and millions position
    let splitNumber = currentInt.split('');
    // Insert the string at the index position
    splitNumber.splice((currentInt.length-3), 0, ',');
    splitNumber.splice((currentInt.length-6), 0, ',');
    // Join back the individual characters
    joinedNumber = splitNumber.join('');
  };
  joinedNumber ? (currentDisplayInt = joinedNumber) : (currentDisplayInt = currentInt);
  currentDisplayNumber = currentDisplayInt + currentDecimal;
  outputDisplay.innerText = currentDisplayNumber;
};

handleInput = (input) => {
  //updates the current number value (without any commas)
  //if the current input is a decimal, add digit to decimal varialbe
  if (input === '.'){
    currentDecimal = input;
    disableDecimal();
    return;
  }
  if (currentDecimal) {
    currentDecimal += input;
    return;
  }
  if ((currentInt ==='0') && parseInt(input) || input === '0') {
      currentInt = input; 
      return;
    } else if(parseInt(input) || input === '0'){
    currentInt += input;
  }
  if (input === '(' || input === ')') {
    fullSequence += input;
    toggleParens();
  }
};

displaySequence = () => {
  if (fullSequence) {
    inputDisplay.innerText = fullSequence;
  }
};

//directs input for appropriate handling
processInput = (input) => {
  console.log('input:', input);
  handleInput(input);
  updateCurrentNumber();
  //limits input to nine digits
  checkLength();
  //displays the input with comma formatting if necessary
  displayNumber();
  displaySequence();
  console.log('currentInt is:', currentInt);
  console.log('currentDecimal is:', currentDecimal);
  console.log('currentNumber is:', currentNumber);
  console.log('display number is:', currentDisplayNumber);
};

//directs fnInput for appropriate handling
processFunction = (fnInput) => {
  console.log('fnInput:', fnInput);
};

// ---- end functions ---- //

// ---- LISTENERS AND CALLS ---- //
// adds event listeners for digits and decimal and passes input value to the variables
inputButtons.forEach(button => {
  button.addEventListener('click', () => {
    let input = button.getAttribute('data-input');
    processInput(input);
  },)
});

functionButtons.forEach(button => {
  button.addEventListener('click', () => {
    let fnInput = button.getAttribute('data-input');
    processFunction(fnInput);
  },)
});

//

displayNumber();

// ---- end listeners and calls ---- //