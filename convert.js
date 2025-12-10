// Conversion factors
const conversions = {
  temperature: {
    celsius: {
      fahrenheit: (val) => (val * 9/5) + 32
    },
    fahrenheit: {
      celsius: (val) => (val - 32) * 5/9
    }
  },
  weight: {
    gram: {
      kilogram: (val) => val / 1000,
      ounce: (val) => val / 28.3495,
      pound: (val) => val / 453.592
    },
    kilogram: {
      gram: (val) => val * 1000,
      ounce: (val) => val * 35.274,
      pound: (val) => val * 2.20462
    },
    ounce: {
      gram: (val) => val * 28.3495,
      kilogram: (val) => val / 35.274,
      pound: (val) => val / 16
    },
    pound: {
      gram: (val) => val * 453.592,
      kilogram: (val) => val / 2.20462,
      ounce: (val) => val * 16
    }
  },
  volume: {
    milliliter: {
      liter: (val) => val / 1000,
      teaspoon: (val) => val / 4.92892,
      tablespoon: (val) => val / 14.7868,
      'fluid-ounce': (val) => val / 29.5735,
      cup: (val) => val / 236.588,
      pint: (val) => val / 473.176,
      quart: (val) => val / 946.353,
      gallon: (val) => val / 3785.41
    },
    liter: {
      milliliter: (val) => val * 1000,
      teaspoon: (val) => val * 202.884,
      tablespoon: (val) => val * 67.628,
      'fluid-ounce': (val) => val * 33.814,
      cup: (val) => val * 4.22675,
      pint: (val) => val * 2.11338,
      quart: (val) => val * 1.05669,
      gallon: (val) => val / 3.78541
    },
    teaspoon: {
      milliliter: (val) => val * 4.92892,
      liter: (val) => val / 202.884,
      tablespoon: (val) => val / 3,
      'fluid-ounce': (val) => val / 6,
      cup: (val) => val / 48,
      pint: (val) => val / 96,
      quart: (val) => val / 192,
      gallon: (val) => val / 768
    },
    tablespoon: {
      milliliter: (val) => val * 14.7868,
      liter: (val) => val / 67.628,
      teaspoon: (val) => val * 3,
      'fluid-ounce': (val) => val / 2,
      cup: (val) => val / 16,
      pint: (val) => val / 32,
      quart: (val) => val / 64,
      gallon: (val) => val / 256
    },
    'fluid-ounce': {
      milliliter: (val) => val * 29.5735,
      liter: (val) => val / 33.814,
      teaspoon: (val) => val * 6,
      tablespoon: (val) => val * 2,
      cup: (val) => val / 8,
      pint: (val) => val / 16,
      quart: (val) => val / 32,
      gallon: (val) => val / 128
    },
    cup: {
      milliliter: (val) => val * 236.588,
      liter: (val) => val / 4.22675,
      teaspoon: (val) => val * 48,
      tablespoon: (val) => val * 16,
      'fluid-ounce': (val) => val * 8,
      pint: (val) => val / 2,
      quart: (val) => val / 4,
      gallon: (val) => val / 16
    },
    pint: {
      milliliter: (val) => val * 473.176,
      liter: (val) => val / 2.11338,
      teaspoon: (val) => val * 96,
      tablespoon: (val) => val * 32,
      'fluid-ounce': (val) => val * 16,
      cup: (val) => val * 2,
      quart: (val) => val / 2,
      gallon: (val) => val / 8
    },
    quart: {
      milliliter: (val) => val * 946.353,
      liter: (val) => val / 1.05669,
      teaspoon: (val) => val * 192,
      tablespoon: (val) => val * 64,
      'fluid-ounce': (val) => val * 32,
      cup: (val) => val * 4,
      pint: (val) => val * 2,
      gallon: (val) => val / 4
    },
    gallon: {
      milliliter: (val) => val * 3785.41,
      liter: (val) => val * 3.78541,
      teaspoon: (val) => val * 768,
      tablespoon: (val) => val * 256,
      'fluid-ounce': (val) => val * 128,
      cup: (val) => val * 16,
      pint: (val) => val * 8,
      quart: (val) => val * 4
    }
  },
  length: {
    millimeter: {
      centimeter: (val) => val / 10,
      meter: (val) => val / 1000,
      inch: (val) => val / 25.4,
      foot: (val) => val / 304.8
    },
    centimeter: {
      millimeter: (val) => val * 10,
      meter: (val) => val / 100,
      inch: (val) => val / 2.54,
      foot: (val) => val / 30.48
    },
    meter: {
      millimeter: (val) => val * 1000,
      centimeter: (val) => val * 100,
      inch: (val) => val * 39.3701,
      foot: (val) => val * 3.28084
    },
    inch: {
      millimeter: (val) => val * 25.4,
      centimeter: (val) => val * 2.54,
      meter: (val) => val / 39.3701,
      foot: (val) => val / 12
    },
    foot: {
      millimeter: (val) => val * 304.8,
      centimeter: (val) => val * 30.48,
      meter: (val) => val / 3.28084,
      inch: (val) => val * 12
    }
  },
  baking: {
    stick: {
      gram: (val) => val * 113.398,
      ounce: (val) => val * 4,
      'cup-butter': (val) => val / 2
    },
    'cup-flour': {
      gram: (val) => val * 120,
      ounce: (val) => val * 4.23
    },
    'cup-sugar': {
      gram: (val) => val * 200,
      ounce: (val) => val * 7.05
    },
    'cup-butter': {
      gram: (val) => val * 226.796,
      ounce: (val) => val * 8,
      stick: (val) => val * 2
    },
    'cup-milk': {
      gram: (val) => val * 240,
      ounce: (val) => val * 8.45
    },
    gram: {
      stick: (val) => val / 113.398,
      'cup-flour': (val) => val / 120,
      'cup-sugar': (val) => val / 200,
      'cup-butter': (val) => val / 226.796,
      'cup-milk': (val) => val / 240
    },
    ounce: {
      stick: (val) => val / 4,
      'cup-flour': (val) => val / 4.23,
      'cup-sugar': (val) => val / 7.05,
      'cup-butter': (val) => val / 8,
      'cup-milk': (val) => val / 8.45
    }
  }
};

function convert(type, from, to, value) {
  if (value === '' || value === null || isNaN(value)) {
    return '';
  }

  const numValue = parseFloat(value);
  
  if (from === to) {
    return numValue;
  }

  const typeConversions = conversions[type];
  if (!typeConversions || !typeConversions[from] || !typeConversions[from][to]) {
    return '';
  }

  const result = typeConversions[from][to](numValue);
  return Math.round(result * 10000) / 10000; // Round to 4 decimal places
}

function setupConverter(type) {
  const inputEl = document.getElementById(`${type}-input`);
  const outputEl = document.getElementById(`${type}-output`);
  const fromSelect = document.getElementById(`${type}-from`);
  const toSelect = document.getElementById(`${type}-to`);
  const swapBtn = document.getElementById(`${type}-swap`);

  function performConversion() {
    const value = inputEl.value;
    const from = fromSelect.value;
    const to = toSelect.value;
    const result = convert(type, from, to, value);
    outputEl.value = result !== '' ? result : '';
  }

  inputEl.addEventListener('input', performConversion);
  fromSelect.addEventListener('change', performConversion);
  toSelect.addEventListener('change', performConversion);

  swapBtn.addEventListener('click', () => {
    const tempFrom = fromSelect.value;
    const tempTo = toSelect.value;
    const tempValue = inputEl.value;
    const tempOutput = outputEl.value;

    fromSelect.value = tempTo;
    toSelect.value = tempFrom;
    inputEl.value = tempOutput;
    outputEl.value = tempValue;
    performConversion();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupConverter('temp');
  setupConverter('weight');
  setupConverter('volume');
  setupConverter('length');
  setupConverter('baking');
});

