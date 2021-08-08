
// ---- VARIABLES ---- //

// VALUE VARIABLES
//the last sequence of number values (int or float value)
let currentNeg = '';
let currentInt = '0';
let currentDecimal = '';
let currentNumber = '';
let currentDisplayInt = '';
//the current input sequence formatted for display
let currentDisplayNumber = '0';

//the full input sequence for display and evaluation
let fullSequence = '';
let fullDisplaySequence = '';

//the calculated value
let currentValue = 0;

//the current operator
let currentOperator = '';

//listener variables
let inputButtons = document.querySelectorAll('.button-input');
let functionButtons = document.querySelectorAll('.button-function');
let operationButtons = document.querySelectorAll('.button-operator');
let parenButtons = document.querySelectorAll('.paren');

//display variables
let outputDisplay = document.querySelector('#output-display');
let inputDisplay = document.querySelector('#input-display');

//RegEx variables to test input
//RegEx for a decimal character
const decRegex = new RegExp(/\./);

// ---- end variables ----//


// ---- FUNCTIONS ---- //

enableButtons = (selector) => {
  let buttons = document.querySelectorAll(`${selector}`);
  buttons.forEach(button => {
    button.disabled = false;
  });
};

disableButtons = (selector) => {
  let buttons = document.querySelectorAll(`${selector}`);
  buttons.forEach(button => {
    button.disabled = true;
  });
};

toggleNeg = () => {
  currentNeg ? currentNeg = '' : currentNeg = '-';
};

initInput = () => {
  currentNeg = '';
  currentInt = '0';
  currentDecimal = '';
  currentNumber = '';
  currentDisplayInt = '';
  currentDisplayNumber = '0';
};

handleParen = (paren) => {
  if (!fullSequence && paren === '(') {
    fullSequence += '(';
    return;
  };
  if (fullSequence.slice(-1) === ' ') {
      if (paren === '(') {
        fullSequence += '(';
        return;
      } else {
        if (currentNumber) {
          fullSequence += currentDisplayNumber + ')'
          initInput();
          updateAndDisplay();
        } else {
        console.log('paren error');
        return;
        };
      };
  };
  //if (fullSequence.match(/(/g) === fullSequence.match(/)/g)) {
  //};
};

resetCalc = () => {
  currentInt = '0';
  currentDecimal = '';
  currentNumber = '';
  currentDisplayInt = '';
  currentNeg = '';
  fullSequence = '';
  currentOperator = '';
  parenButtons[0].disabled = false;
  parenButtons[1].disabled = true;
};

//updates the current number by concat the value, int value, and floats
updateCurrentNumber = () => {
  currentNumber = currentNeg + currentInt + currentDecimal;
  if(!currentNumber) {
    currentInt = '0';
  };
};

checkLength = () => {
  let numberLength = (currentNumber.replace(/\D/g,'')).length;
  if (numberLength >= 9 ){
    console.log('She can\'t take any more Captain!');
    inputDisplay.innerText = `She can't take any more, Captain!`;
    disableButtons('.button-num');
  } else {
    enableButtons('.button-num');
  }
};

//adds comma formatting if necessary and displays the input
displayNumber = () => {
  let joinedNumber;
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
  currentDisplayNumber = currentNeg + currentDisplayInt + currentDecimal;
  outputDisplay.innerText = currentDisplayNumber;
};

handleInput = (input) => {
  //if there is an operator action, add it to the full sequence and 
  if (currentNumber) {
    disableButtons('#paren-l');
    enableButtons('#paren-r');
  } else enableButtons('#paren-l');
  if(currentOperator) {
    updateFullSequence(' ' + currentOperator + ' ');
    currentOperator = '';
  };
  //if the current input is a decimal, add digit to decimal varialbe
  if (input === '.'){
    currentDecimal = input;
    disableButtons('#decml');
    return;
  }
  if (currentDecimal) {
    currentDecimal += input;
    return;
  }
  if ((currentInt ==='0') && (parseInt(input) || input === '0')) {
      currentInt = input; 
      return;
    } else if(parseInt(input) || input === '0'){
    currentInt += input;
  }
};

updateFullSequence = (input) => {
  if (input) {
    if (fullSequence) {
      fullSequence += input;
      inputDisplay.innerText = fullSequence;
    }
  } else {
      if (fullSequence) {
        while (fullSequence.slice(-1) === '0') {
          fullSequence = fullSequence.slice(0, -1)
        } 
        inputDisplay.innerText = fullSequence;
      }
      else {
        inputDisplay.innerText = '';
      };
  };
};

updateAndDisplay = (input) => {
  //updates the current number by concat +/- value, int value, and float values
  updateCurrentNumber();
  //adds comma formatting if necessary and displays the input in the output display section
  displayNumber();
  //displays the full input in the input display
  updateFullSequence();
  //limits input to nine digits
  checkLength();
};

//directs input for appropriate handling
processInput = (input) => {
  console.log('input:', input);
  handleInput(input);
  updateAndDisplay(input);
};

handleDelete = () => {
  if(currentDecimal) {
    currentDecimal = currentDecimal.slice(0, -1);
    if(!currentDecimal) {
      enableButtons('#decml');
      };
    return;
  };
  if(parseInt(currentInt)) {
    currentInt = currentInt.slice(0, -1);
    return;
  };
  if(currentNeg && !parseInt(currentInt)) {
    currentNeg = '';
    return;
  };
};

//function handling
handleFunction = (fnInput) => {
  if (fnInput === 'del') {
    handleDelete();
  };
  if (fnInput === 'clear') {
    resetCalc();
  };
  if (fnInput === '+-') {
    toggleNeg();
  };
  if (fnInput === '(' || fnInput === ')') {
    handleParen(fnInput);
  }
  updateAndDisplay();
};

handleOperator = (operator) => {
  if(!currentOperator) {
    if(currentNumber) {
      fullSequence += currentDisplayNumber;
    } else if(!currentNumber && !fullSequence) {
      fullSequence += '0';
      currentNumber = '0';
    };
  };
  enableButtons('.button-input');
  initInput();
  currentOperator = operator;
  outputDisplay.innerText = currentOperator;
  inputDisplay.innerText = fullSequence;
};

processOperator = (operator) => {
  console.log('operator:', operator);
  (operator != '=') ? handleOperator(operator) : handleEquals();
};

//directs input for appropriate handling
processFunction = (fnInput) => {
  console.log('function input:', fnInput);
  handleFunction(fnInput);
  updateAndDisplay();
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

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    let operator = button.getAttribute('data-input');
    processOperator(operator);
  },)
});

displayNumber();

// ---- end listeners and calls ---- //