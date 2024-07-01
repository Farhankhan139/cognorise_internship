const display = document.getElementById('display');
const history = document.getElementById('history');
let currentExpression = '';
let lastOperator = ''; // To track consecutive operators

function updateDisplay(value) {
  // Prevent starting with an operator except "-" for negative numbers
  if (currentExpression === '' && !isNaN(value) || value === '-') {
    currentExpression += value;
  } else if (!isNaN(value) || value === '.' || 
             (lastOperator !== '' && ['*', '/', '+', '-'].includes(value))) { 
    // Allow numbers, decimals, and operators after valid input
    currentExpression += value;
  }
  display.innerText = currentExpression;
  lastOperator = value; // Update lastOperator for validation
}

function clearDisplay() {
  currentExpression = '';
  display.innerText = '';
  lastOperator = ''; // Reset lastOperator
}

function deleteLastChar() {
  // Handle deletion of the last character or operand properly
  if (currentExpression.length > 0) {
    const lastChar = currentExpression.slice(-1);
    if (lastChar === ' ') {
      currentExpression = currentExpression.slice(0, -3); // Remove operator and space
    } else {
      currentExpression = currentExpression.slice(0, -1); // Remove last character
    }
    display.innerText = currentExpression;
  }
}

function calculate() {
  try {
    const result = eval(currentExpression);
    history.innerText = currentExpression + ' = ' + result;
    currentExpression = result.toString(); // Update currentExpression for further calculations
    lastOperator = ''; // Reset lastOperator after successful calculation
  } catch (error) {
    display.innerText = 'Error';
    console.error('Calculation Error:', error);
  }
}

const buttons = document.querySelectorAll('.buttons button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    switch (value) {
      case 'C':
        clearDisplay();
        break;
      case 'DEL':
        deleteLastChar();
        break;
      case '=':
        calculate();
        break;
      default:
        updateDisplay(value);
    }
  });
});
