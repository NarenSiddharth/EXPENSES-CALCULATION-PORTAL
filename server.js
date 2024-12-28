// Required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Function to calculate costs
function calculateCosts(expenses, mincount, maxcount) {
  const ttlamountwithoutcnce = (expenses / 40) * 100;
  const ttlamountwithcnce = (ttlamountwithoutcnce / 75) * 100;

  // Minimum count calculations
  const earlybirdcountMin = 0.2 * mincount;
  const withoutearlybirdcountMin = mincount - earlybirdcountMin;
  const normalcostMin = ttlamountwithcnce / (earlybirdcountMin * 0.8 + withoutearlybirdcountMin);
  const earlybirdcostMin = normalcostMin * 0.8;

  // Maximum count calculations
  const earlybirdcountMax = 0.2 * maxcount;
  const withoutearlybirdcountMax = maxcount - earlybirdcountMax;
  const normalcostMax = ttlamountwithcnce / (earlybirdcountMax * 0.8 + withoutearlybirdcountMax);
  const earlybirdcostMax = normalcostMax * 0.8;

  return {
    normalCostMin: Math.round(normalcostMin),
    earlyBirdCostMin: Math.round(earlybirdcostMin),
    normalCostMax: Math.round(normalcostMax),
    earlyBirdCostMax: Math.round(earlybirdcostMax),
  };
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/calculate', (req, res) => {
  console.log(req.body);
  const { expenses, mincount, maxcount } = req.body;

  // Validate input
  if (!expenses || !mincount || !maxcount) {
    return res.status(400).send('All fields are required.');
  }

  const result = calculateCosts(Number(expenses), Number(mincount), Number(maxcount));
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
