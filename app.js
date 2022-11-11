// Story:
// Mechanical keyboards business: initial price - 1000 UAH
const randomSign = () => Math.random() > 0.5 ? 1 : -1;
const getExponentialRandomForDeviation = (t) => randomSign() * Math.random() * Math.exp(t)

// Weight coefficient
// The model with learning, but close to the highest boundary i.e. 1
// Is defined in the requirements in the LAB 4
const p = 0.9;

let ut = [];
let prices = [];
let DResults = [];
let SResults = [];

let chart = null;
let priceChart = null;

let inputData;
let parametersData;

// Demand
// x: price
// t: iteration
function D(t) {
  const { A, B } = parametersData;
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  return A - (B * Math.pow(prices[t], 2)) + ut[t]
}

// Supply
function S(t) {
  const { C, K } = parametersData;
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  // when t = 0 we still don't have the t - 1 price, let's assume it is 0
  const Xp = (prices[prices.length - 2] || 0) - p * ((prices[prices.length - 2] || 0) - (prices[prices.length - 3] || 0));
  return C + K * Xp + getExponentialRandomForDeviation(t)
}

function findNextStepPrice(t) {
  const { A, B } = parametersData;
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  const nextPriceSquared = -((SResults[t - 1] - A - ut[t]) / B);

  // important
  return nextPriceSquared > 0 ? Math.sqrt(nextPriceSquared) : 0;
}

function model() {
  const { num_iterations: numIterations, initial_price: initialPrice } = inputData;

  ut = [];
  prices = [initialPrice, initialPrice + 150, initialPrice - 250];

  DResults = [D(0)];
  SResults = [S(0)];

  for (let t = 1; t < numIterations; t += 1) {
    if (t > 2) {
      prices.push(findNextStepPrice(t));
    }
    DResults.push(D(t));
    SResults.push(S(t));
  }

  const labels = (new Array(numIterations)).fill(0).map((_, index) => index);

  const config = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: 'Demand',
          backgroundColor: 'red',
          borderColor: 'red',
          data: DResults,
        },
        {
          label: 'Supply',
          backgroundColor: 'blue',
          borderColor: 'blue',
          data: SResults,
        },
      ],
    },
    options: {},
  };

  const config2 = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: 'Price',
          backgroundColor: 'green',
          borderColor: 'green',
          data: prices,
        }
      ],
    },
    options: {},
  };

  if (chart) {
    chart.destroy();
    chart = null;
  }

  chart = new Chart(
    document.getElementById("chart"),
    config
  );

  if (priceChart) {
    priceChart.destroy();
    priceChart = null;
  }

  priceChart = new Chart(
    document.getElementById("chart_price"),
    config2
  );
}

// forms
const submitButton = window.form_submit;
const formInput = window.model_input_form;
const formParameters = window.model_parameters_form;

function serializeForm(formElement) {
  const formEntries = Array.from(new FormData(formElement));
  const formEntriesNormalized = formEntries.map(([key, value]) => [key, Number(value)]);

  return Object.fromEntries(formEntriesNormalized)
}

submitButton.addEventListener('click', () => {
  inputData = serializeForm(formInput);
  parametersData = serializeForm(formParameters);

  model();
});
