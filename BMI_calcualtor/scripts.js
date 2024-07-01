const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const calculateButton = document.getElementById('calculate');
const bmiValue = document.getElementById('bmi-value');
const bmiCategory = document.getElementById('bmi-category');

calculateButton.addEventListener('click', () => {
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value) / 100; // Convert cm to meters

  if (weight > 0 && height > 0) {
    const bmi = weight / (height * height);
    bmiValue.innerText = `Your BMI: ${bmi.toFixed(2)}`;

    let category;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi < 25) {
      category = 'Normal weight';
    } else if (bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }
    bmiCategory.innerText = `BMI Category: ${category}`;
  } else {
    bmiValue.innerText = 'Invalid input. Please enter positive values.';
    bmiCategory.innerText = '';
  }
});
