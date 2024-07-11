const apiKey = '12f11cf0d7de0aaedca3ddef';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

document.addEventListener('DOMContentLoaded', () => {
  const fromCurrency = document.getElementById('fromCurrency');
  const toCurrency = document.getElementById('toCurrency');
  const amount = document.getElementById('amount');
  const convertButton = document.getElementById('convertButton');
  const result = document.getElementById('result');

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const currencies = Object.keys(data.conversion_rates);
      populateSelectBoxes(currencies);
    });

  convertButton.addEventListener('click', () => {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amountValue = parseFloat(amount.value);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    convertCurrency(from, to, amountValue);
  });

  function populateSelectBoxes(currencies) {
    currencies.forEach(currency => {
      const option1 = document.createElement('option');
      option1.value = currency;
      option1.textContent = currency;
      fromCurrency.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = currency;
      option2.textContent = currency;
      toCurrency.appendChild(option2);
    });
  }

  function convertCurrency(from, to, amount) {
    fetch(`${apiUrl}`)
      .then(response => response.json())
      .then(data => {
        const rate = data.conversion_rates[to] / data.conversion_rates[from];
        const convertedAmount = (amount * rate).toFixed(2);
        result.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
        result.classList.add('show');
      });
  }
});
