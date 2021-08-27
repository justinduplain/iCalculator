// ---- VARIABLES ---- //

// VALUE VARIABLES
//the last sequence of number values (int or float value)
let currentNeg = "";
let currentInt = "0";
let currentDecimal = "";
let currentNumber = "";
let currentDisplayInt = "";
//the current input sequence formatted for display
let currentDisplayNumber = "0";

//the full input sequence for display and evaluation
let fullSequence = "";

//the calculated value
let currentValue = 0;

//the current operator
let currentOperator = "";

//listener variables
const inputButtons = document.querySelectorAll(".button-input");
const functionButtons = document.querySelectorAll(".button-function");
const operationButtons = document.querySelectorAll(".button-operator");
const parenButtons = document.querySelectorAll(".paren");

//display variables
const outputDisplay = document.querySelector("#output-display span");
const inputDisplay = document.querySelector("#input-display");

//RegEx variables to test input
const lParExp = new RegExp(/\(/g);
const rParExp = new RegExp(/\)/g);

// ---- end variables ----//

// ---- FUNCTIONS ---- //

enableButtons = (selector) => {
  let buttons = document.querySelectorAll(`${selector}`);
  buttons.forEach((button) => {
    button.disabled = false;
  });
};

disableButtons = (selector) => {
  let buttons = document.querySelectorAll(`${selector}`);
  buttons.forEach((button) => {
    button.disabled = true;
  });
};

toggleNeg = () => {
  currentNeg ? (currentNeg = "") : (currentNeg = "-");
};

initInput = () => {
  currentNeg = "";
  currentInt = "0";
  currentDecimal = "";
  currentNumber = "";
  currentDisplayInt = "";
  currentDisplayNumber = "";
  currentOperator = "";
  currentValue = 0;
  enableButtons(".button");
};

handleParen = (paren) => {
  if (!fullSequence && paren === "(") {
    fullSequence += "(";
    updateAndDisplay();
    initInput();
    enableButtons("#paren-r");
    disableButtons("#paren-l");
    return;
  }
  if (currentOperator && paren === "(") {
    fullSequence += " " + currentOperator + " (";
    updateAndDisplay();
    initInput();
    enableButtons(".button");
    disableButtons("#paren-l");
    disableButtons(".button-operator");
    return;
  }
  if (fullSequence.slice(-1) === " ") {
    if (paren === "(") {
      fullSequence += "(";
      return;
    } else {
      if (currentNumber) {
        fullSequence += currentDisplayNumber + ")";
        initInput();
        disableButtons(".button");
        enableButtons(".button-operator");
        enableButtons("#allclear");
        enableButtons("#backspace");
        inputDisplay.innerText = fullSequence;
        outputDisplay.innerText = "";
        return;
      } else {
        console.log("paren error");
        return;
      }
    }
    return;
  }
  return;
};

resetCalc = () => {
  currentValue = 0;
  currentInt = "0";
  currentDecimal = "";
  currentNumber = "";
  currentDisplayInt = "";
  currentDisplayNumber = "";
  currentNeg = "";
  fullSequence = "";
  currentOperator = "";
  enableButtons(".button");
  parenButtons[1].disabled = true;
  displayNumber();
};

//updates the current number by concatentation
updateCurrentNumber = () => {
  //If there's a current value, split it up and put it into the input variables
  if (currentValue) {
    //place the current value into an array split on the decimal
    let valString = currentValue.toLocaleString("en-US");
    let vals = valString.split(".");
    console.log("vals:", vals);
    //handles negatives
    if (vals[0].slice(0, 1) === "-") {
      currentNeg = "-";
      currentInt = vals[0].slice(1);
      currentInt = currentInt.replace(/,/g, "");
    } else {
      //handle positive
      currentNeg = "";
      currentInt = vals[0].replace(/,/g, "");
    }
    //if there is one, handle decimals
    if (vals[1]) {
      currentDecimal = "." + vals[1];
    } else {
      currentDecimal = "";
    }
    currentValue = 0;
  }
  //update the current number value based on input
  currentNumber = currentNeg + currentInt + currentDecimal;
  if (!currentNumber) {
    currentInt = "";
  }
};

numberLength = () => {
  let numberLength = currentNumber.replace(/\D/g, "").length;
  return numberLength;
};

function expo(x, f) {
  console.log("exponent:", x.toExponential(f));
  return x.toExponential(f);
}

displayError = (error) => {
  inputDisplay.innerText = error;
  setTimeout(updateAndDisplay, 1000);
  return;
};

//long input shows smaller in the display
setLengthClasses = () => {
  if (numberLength() <= 5) {
    outputDisplay.classList = "";
  }
  if (numberLength() > 6) {
    outputDisplay.classList = "thnd";
  }
  if (numberLength() > 8) {
    outputDisplay.classList = "mil";
  }
  if (currentDisplayNumber.includes("e")) {
    outputDisplay.classList = "mil";
  }
};

//limits input to nine digits
checkInputLength = () => {
  setLengthClasses();
  if (numberLength() >= 9) {
    disableButtons(".button-num");
  } else {
    enableButtons(".button-num");
  }
};

//adds comma formatting if necessary and displays the input
displayNumber = () => {
  let joinedNumber;
  if (currentInt && currentInt.length > 3 && currentInt.length <= 6) {
    // Split the current sequence and add a comma in the thousands position
    let splitNumber = currentInt.split("");
    splitNumber.splice(currentInt.length - 3, 0, ",");
    joinedNumber = splitNumber.join("");
  }
  if (currentInt && currentInt.length > 6 && currentInt.length <= 9) {
    // Split and add commas in in the thousands and millions position
    let splitNumber = currentInt.split("");
    // Insert the string at the index position
    splitNumber.splice(currentInt.length - 3, 0, ",");
    splitNumber.splice(currentInt.length - 6, 0, ",");
    // Join back the individual characters
    joinedNumber = splitNumber.join("");
  }
  joinedNumber
    ? (currentDisplayInt = joinedNumber)
    : (currentDisplayInt = currentInt);
  currentDisplayNumber = currentNeg + currentDisplayInt + currentDecimal;
  outputDisplay.innerText = currentDisplayNumber;
};

handleInput = (input) => {
  if (currentValue) {
    resetCalc();
  }
  if (currentOperator) {
    updateFullSequence(" " + currentOperator + " ");
    currentOperator = "";
  }
  //if the current input is a decimal, add digit to decimal varialbe
  if (input === ".") {
    currentDecimal = input;
    disableButtons("#decml");
    return;
  }
  if (currentDecimal) {
    currentDecimal += input;
    return;
  }
  if (currentInt === "0" && (parseInt(input) || input === "0")) {
    currentInt = input;
  } else if (parseInt(input) || input === "0") {
    currentInt += input;
  }
  updateAndDisplay();
  if (currentNumber) {
    enableButtons(".button");
    disableButtons("#paren-l");
  } else {
    enableButtons("#paren-l");
    disableButtons(".button-operator");
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
      while (fullSequence.slice(-1) === "0") {
        fullSequence = fullSequence.slice(0, -1);
      }
      inputDisplay.innerText = fullSequence;
    } else {
      inputDisplay.innerText = "";
    }
  }
};

updateAndDisplay = (input) => {
  //updates the current number by concat +/- value, int value, and float values
  updateCurrentNumber();
  //adds comma formatting if necessary and displays the input in the output display section
  updateFullSequence();
  //displays the full input in the input display
  displayNumber();
  //limits input to nine digits
  checkInputLength();
};

//directs input for appropriate handling
processInput = (input) => {
  console.log("input:", input);
  handleInput(input);
  updateAndDisplay(input);
};

handleDelete = () => {
  if (currentDecimal) {
    currentDecimal = currentDecimal.slice(0, -1);
    if (!currentDecimal) {
      enableButtons("#decml");
    }
    return;
  }
  if (parseInt(currentInt)) {
    currentInt = currentInt.slice(0, -1);
    return;
  }
  if (currentNeg && !parseInt(currentInt)) {
    currentNeg = "";
    return;
  }
};

//function handling
handleFunction = (fnInput) => {
  if (fnInput === "del") {
    handleDelete();
  }
  if (fnInput === "Clear") {
    resetCalc();
  }
  if (fnInput === "+-") {
    toggleNeg();
  }
  if (fnInput === "(" || fnInput === ")") {
    handleParen(fnInput);
    return;
  }
  if (fnInput === "%") {
    currentValue = operate(currentNumber / 100);
    updateCurrentNumber();
  }
  updateAndDisplay();
};

handleOperator = (operator) => {
  if (!currentOperator) {
    if (fullSequence.slice(-1) === "=") {
      fullSequence = fullSequence.slice(0, -2);
      inputDisplay.innerText = fullSequence;
    }
    if (currentNumber.includes("e")) {
    } else {
      if (currentNumber && !currentValue) {
        fullSequence += currentDisplayNumber;
      } else if (!currentNumber && !fullSequence) {
        fullSequence += "0";
        initInput();
      } else if (!currentNumber && fullSequence.slice(-1 === ")")) {
        currentOperator = operator;
        outputDisplay.innerText = currentOperator;
        inputDisplay.innerText = fullSequence;
      }
    }
  }
  initInput();
  enableButtons(".button");
  disableButtons("#paren-r");
  currentOperator = operator;
  outputDisplay.innerText = currentOperator;
  inputDisplay.innerText = fullSequence;
};

operate = (sequence) => {
  let val;
  val = Function('"use strict";return (' + sequence + ")")();
  if (val > 999999999 || val < 0.001) {
    return expo(val, 4);
  } else return val;
};

formatSequence = (sequence) => {
  let evalSequence = sequence;
  evalSequence = evalSequence.replaceAll("÷", "/");
  evalSequence = evalSequence.replaceAll("×", "*");
  evalSequence = evalSequence.replaceAll(",", "");
  return evalSequence;
};

//The output number can sometimes have move digits than we have room to display. We want to format the output based on how many whole number integer digits there are, only dispalying a max of 9 digits. Ie. when there are 8 integers there should only be one decimal digit displayed, 7 integers and 2 can be displayed
formatDisplayNumber = (numberString, value) => {
  //chunk out the number string for assesment
  let numArray = numberString.split(".");
  let intCount;
  let decCount;
  let decDigits;
  if (numArray[0]) {
    intCount = numArray[0].length;
  }
  if (numArray[1]) {
    decCount = numArray[1].length;
  }
  console.log(intCount + ",", decCount);
  //if there is no decimal, return a properly formatted whole number
  if (!decCount) {
    return value.toLocaleString("en-US");
  }
  //if there is a decimal, make sure the number of digits available is max 9.
  if (decCount) {
    decDigits = 9 - intCount;
  }
  console.log("decDigits:", decDigits);
  if (decDigits > 0) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decDigits
    });
  } else {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
};

handleEquals = () => {
  //if equals has been added to the input display, don't add it  again
  if (fullSequence.slice(-1) === "=") {
    inputDisplay.innerHTML = fullSequence;
    return;
  }
  //checks for matched parentheses in the sequence
  let parenLCount;
  let parenRCount;
  //if left & right parenthases don't match count, throw an error
  if (fullSequence.match(lParExp)) {
    parenLCount = fullSequence.match(lParExp).length;
  }
  if (fullSequence.match(rParExp)) {
    parenRCount = fullSequence.match(rParExp).length;
  }
  if (parenLCount && parenLCount != parenRCount) {
    displayError("parentheses error");
    return;
  }
  //we pressed equal so clear the current operator
  if (currentOperator) {
    currentOperator = "";
  }
  //if there is one, add the last input to the displayed sequence, otherwise just add an equal sign
  if (currentNumber) {
    fullSequence += currentDisplayNumber + " =";
    initInput();
    updateAndDisplay();
    disableButtons(".button-num");
  } else {
    fullSequence += " =";
  }
  inputDisplay.innerText = fullSequence;
  //now take the equals sign back off so we can evaluate the expression
  let evalString = fullSequence.slice(0, -2);
  //send the string off to be formatted correctly
  let evalSequence = formatSequence(evalString);
  //operate the sequence and assign it to the current value
  currentValue = operate(evalSequence);
  //add the value to the string-formatted variable
  currentNumber = currentValue.toString();
  //update the number for display in the output area
  currentDisplayNumber = formatDisplayNumber(currentNumber, currentValue);
  outputDisplay.innerText = currentDisplayNumber;
  console.log("currentNumber: ", currentNumber);
  console.log("currentDisplayNumber: ", currentDisplayNumber);
  //assign the correct class depending on the length of the string
  setLengthClasses();
  //update the fullSequence to match the output
  fullSequence = currentDisplayNumber + " =";
  //disable further number input pending an operator
  disableButtons(".button-num");
};

processOperator = (operator) => {
  console.log("operator:", operator);
  operator != "=" ? handleOperator(operator) : handleEquals();
};

//directs input for appropriate handling
processFunction = (fnInput) => {
  console.log("function input:", fnInput);
  handleFunction(fnInput);
};

// ---- end functions ---- //

// ---- LISTENERS AND CALLS ---- //
// adds event listeners for digits and decimal and passes input value to the variables
inputButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let input = button.getAttribute("value");
    processInput(input);
  });
});

functionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let fnInput = button.getAttribute("value");
    processFunction(fnInput);
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let operator = button.getAttribute("value");
    processOperator(operator);
  });
});

displayNumber();

function clickButton(e) {
  e.preventDefault();
  const button = document.querySelector(`[data-key="${e.key}"]`);
  button.click();
};

window.addEventListener('keydown', clickButton);

// ---- end listeners and calls ---- //
