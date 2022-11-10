// Story:
// Mechanical keyboards: 2000
const randomSign = () => Math.random() > 0.5 ? 1 : -1;
const getExponentialRandomForDeviation = (t) => randomSign() * Math.random() * Math.exp(t)
// const getRandom = (t) => randomSign() * t * Math.random()

// Weight coefficient
// The model with learning, but close to the highest boundary i.e. 1
const p = 0.5;

// coefficients of linear regression
const A = 1;
// Should be higher than K
const B = 2;

const C = 1;
const K = 1;

const numIterations = 25

// UAH
const initialPrice = 2000;
const prices = [initialPrice, initialPrice + 150, initialPrice - 250];
const ut = [];

// Demand
// x: price
// t: iteration
function D(t) {
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  return A - (B * Math.pow(prices[t], 2)) + ut[t]
}

// Supply
function S(t) {
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  // when t = 0 we still don't have the t - 1 price, let's assume it is 0
  const Xp = (prices[prices.length - 2] || 0) - p * ((prices[prices.length - 2] || 0) - (prices[prices.length - 3] || 0));
  return C + K * Xp + getExponentialRandomForDeviation(t)
}

const DResults = [D(0)];
const SResults = [S(0)];

function findNextStepPrice(t) {
  ut[t] = ut[t] || getExponentialRandomForDeviation(t);
  const nextPrice = -((SResults[t - 1] - A - ut[t]) / B);
  return nextPrice > 0 ? Math.sqrt(nextPrice) : 0;
}

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

new Chart(
  document.getElementById("chart"),
  config
);

new Chart(
  document.getElementById("chart_price"),
  config2
);
