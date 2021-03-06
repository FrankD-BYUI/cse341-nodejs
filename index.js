const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/calculate', (req, res) => {
    calculateRate(req.query.type, req.query.weight, (error, result) => {
      const cost = result;
      res.render('pages/calc-result', {
        error,
        cost
      })
    })
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


function calculateRate(type, weight, callback) {
  if (type === undefined || weight === undefined) {
    return callback("Error: must provdie type and weight", null);
  }

  weight = parseFloat(weight);

  let cost;

  switch (type) {
    case 'stamped':
      if (weight <= 1) {
        cost = 0.55;
      } else if (weight <= 2) {
        cost = 0.75;
      } else if (weight <= 3) {
        cost = 0.95;
      } else if (weight <= 3.5) {
        cost = 1.15;
      }
      break;

    case 'metered':
      if (weight <= 1) {
        cost = 0.51;
      } else if (weight <= 2) {
        cost = 0.71;
      } else if (weight <= 3) {
        cost = 0.91;
      } else if (weight <= 3.5) {
        cost = 1.11;
      }
      break;

    case 'envelope':
      cost = 1.0 + (0.2 * (weight - 1));
      break;

    case 'package':
      if (weight <= 4) {
        cost = 4.0;
      } else if (weight <= 8) {
        cost = 4.8;
      } else if (weight <= 12) {
        cost = 5.5;
      } else if (weight <= 13) {
        cost = 6.25;
      }
      break;

    default:
      return callback("Error: Invalid type", null);
  }

  callback(null, cost);
}