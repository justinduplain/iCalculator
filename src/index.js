
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
let evalSequence;

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
const lParExp = new RegExp(/\(/g);
const rParExp = new RegExp(/\)/g);

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
  currentDisplayNumber = '';
  currentOperator = '';
  enableButtons('.button');
};

handleParen = (paren) => {
  if (!fullSequence && paren === '(') {
    fullSequence += '(';
    updateAndDisplay();
    initInput();
    enableButtons('#paren-r');
    disableButtons('#paren-l');
    return;
  };
  if(currentOperator && paren === '(') {
    fullSequence += (' ' + currentOperator + ' (');
    updateAndDisplay();
    initInput();
    enableButtons('.button');
    disableButtons('#paren-l');
    disableButtons('.button-operator');
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
          disableButtons('.button');
          enableButtons('.button-operator');
          enableButtons('#allclear');
          enableButtons('#backspace');
          inputDisplay.innerText = fullSequence;
          outputDisplay.innerText = '';
          return;
        } else {
        console.log('paren error');
        return;
        };
      };
      return; 
      };
  return;
 };

resetCalc = () => {
  currentInt = '0';
  currentDecimal = '';
  currentNumber = '';
  currentDisplayInt = '';
  currentDisplayNumber = '';
  currentNeg = '';
  fullSequence = '';
  currentOperator = '';
  enableButtons('.button');
  parenButtons[1].disabled = true;
  displayNumber();
};

//updates the current number by concat the value, int value, and floats
updateCurrentNumber = () => {
  currentNumber = currentNeg + currentInt + currentDecimal;
  if(!currentNumber) {
    currentInt = '';
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
  if ((currentInt === '0') && (parseInt(input) || input === '0')) {
      currentInt = input; 
    } else if(parseInt(input) || input === '0'){
    currentInt += input;
  }
  updateAndDisplay();
  if (currentNumber) {
    enableButtons('.button');
    disableButtons('#paren-l');
  } else {
    enableButtons('#paren-l');
    disableButtons('.button-operator');
  };
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
  updateFullSequence();
  displayNumber();
    //displays the full input in the input display
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
    return;
  }
  updateAndDisplay();
};

handleOperator = (operator) => {
  if(!currentOperator) {
    if(currentNumber) {
      fullSequence += currentDisplayNumber;
    } else if(!currentNumber && !fullSequence) {
      fullSequence += '0';
      initInput();
    } else if(!currentNumber && fullSequence.slice((-1) === ')')) {
      currentOperator = operator;
      outputDisplay.innerText = currentOperator;
      inputDisplay.innerText = fullSequence;
    };
  };
  initInput();
  enableButtons('.button');
  disableButtons('#paren-r');
  currentOperator = operator;
  outputDisplay.innerText = currentOperator;
  inputDisplay.innerText = fullSequence;
};

operate = () => {
  let val;
  val = Function('"use strict";return (' + evalSequence + ')')();
  val = val.valueOf();
  if (val % 1 === 0) {
    return val;
  }else return val;
};

handleEquals = (equals) => {
  let parenLCount;
  let parenRCount;
  if (fullSequence.match(lParExp)) {
    parenLCount = fullSequence.match(lParExp).length;
  };
  if (fullSequence.match(rParExp)) {
    parenRCount = fullSequence.match(rParExp).length;
  };
  if (fullSequence.slice(-1) === '='){
    return;
  };
  if(parenLCount && (parenLCount != parenRCount)) {
    console.log('parentheses error, please correct')
    inputDisplay.innerText = 'parentheses error';
    setTimeout(updateAndDisplay, 1000);
    return;
  };
  if(currentOperator) {
    currentOperator = '';
  };
  if (currentNumber) {
    fullSequence += currentNumber + ' =';
    initInput();
    updateAndDisplay();
    disableButtons('.button-num');
  } else {
    fullSequence += ' =';
  }
  inputDisplay.innerText = fullSequence;
  evalSequence = fullSequence.slice(0, -2);
  evalSequence = evalSequence.replaceAll('÷', '/');
  evalSequence = evalSequence.replaceAll('×', '*');
  currentValue = operate();
  outputDisplay.innerText = currentValue;
};

processOperator = (operator) => {
  console.log('operator:', operator);
  (operator != '=') ? handleOperator(operator) : handleEquals(operator);
};

//directs input for appropriate handling
processFunction = (fnInput) => {
  console.log('function input:', fnInput);
  handleFunction(fnInput);
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