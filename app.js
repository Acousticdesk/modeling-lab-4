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
const initialPrice = 100;
const prices = [initialPrice];

// Demand
// x: price
// t: iteration
function D(t) {
  return A - (B * Math.pow((prices[t]), 2)) + getExponentialRandomForDeviation(t)
}

// Supply
function S(t) {
  // when t = 0 we still don't have the t - 1 price, let's assume it is 0
  const Xp = (prices[t - 1] || 0) - p * ((prices[t - 1] || 0) - prices[t]);
  return C + K * Xp + getExponentialRandomForDeviation(t)
}

function findNextStepPrice(t) {
  return -((S(t - 1) - A - getExponentialRandomForDeviation(t)) / B)
}

const DResults = [D(0)];
const SResults = [S(0)];

for (let t = 1; t < numIterations; t += 1) {
  prices.push(findNextStepPrice(t));
  DResults.push(D(t));
  SResults.push(S(t));
}
