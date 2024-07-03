const display = document.getElementById('display');
const history = document.getElementById('history');
let currentExpression = '';
let lastOperator = '';

function updateDisplay(value) {
  if (currentExpression === '' && !isNaN(value) || value === '-') {
    currentExpression += value;
  } else if (!isNaN(value) || value === '.' || 
             (lastOperator !== '' && ['*', '/', '+', '-'].includes(value))) {
    currentExpression += value;
  }
  display.innerText = currentExpression;
  lastOperator = value;
}

function clearDisplay() {
  currentExpression = '';
  display.innerText = '';
  lastOperator = '';
}

function deleteLastChar() {
  if (currentExpression.length > 0) {
    const lastChar = currentExpression.slice(-1);
    if (lastChar === ' ') {
      currentExpression = currentExpression.slice(0, -3);
    } else {
      currentExpression = currentExpression.slice(0, -1);
    }
    display.innerText = currentExpression;
  }
}

function calculate() {
  try {
    const result = eval(currentExpression);
    history.innerText = currentExpression + ' = ' + result;
    currentExpression = result.toString();
    lastOperator = '';
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
