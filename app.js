const randomSign = () => Math.random() > 0.5 ? 1 : -1;
const getExponentialRandomForDeviation = (t) => randomSign() * Math.random() * Math.exp(t)
// const getRandom = (t) => randomSign() * t * Math.random()

// Weight coefficient
// The model with learning, but close to the highest boundary i.e. 1
const p = 0.9;

// coefficients of linear regression
const A = 1;
// Should be higher than K
const B = 2;

const C = 1;
const K = 1;

const numIterations = 100

// UAH
const initialPrice = 10;
const prices = [initialPrice];

// Demand
// x: price
// t: iteration
function D(t) {
  return A - (B * Math.pow(prices[prices.length - 2], 2)) + getExponentialRandomForDeviation(t)
}

// Supply
function S(t) {
  const Xp = (prices[prices.length - 2] || 0) - p((prices[prices.length - 2] || 0) - prices[prices.length - 1]);
  return C + K * Xp + getExponentialRandomForDeviation(t)
}

function findNextStepPrice(t) {
  return -((S(t - 1) - A - getExponentialRandomForDeviation(t)) / B)
}

if (D(0) < S(0)) {
  throw new Error(`Incorrect initial price set. D(0) > S(0) is required. Instead received D(0) = ${D(0)}, S(0) = ${S(0)}`)
}

const DResults = [D(0)];
const SResults = [S(0)];

for (let i = 1; i < numIterations; i += 1) {
  prices.push(findNextStepPrice(t));
  DResults.push(D(i));
  SResults.push(S(i));
}
