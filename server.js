const express = require('express');
const app = express();
const port = 3030;
const cors = require('cors');
const bodyParser  = require('body-parser');
const request = require('request');
require('dotenv').config();
const access_token = process.env.ACCESS_TOKEN;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

let headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  'Authorization': `Bearer ${access_token}`,
};

app.get('/', (req, res) => res.send(`The Plant Store's SERVER!`))
let lineItems;
let orderId;
let mId = 'S5SYG4KS612T1';

// When user goes to the Menu page, get merchant's inventory.
app.get('/inventory', (req, res) => {
  const options = {
    method: 'GET',
    url: `https://sandbox.dev.clover.com/v3/merchants/${mId}/items`,
    qs: {access_token}
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });
});

// When user clicks CHECKOUT -> Save the order.
app.post('/save-order', (req, res) => {
  lineItems = req.body;
});

// When user clicks PLACE ORDER -> Create the order.
app.post('/create-order', (req, res) => {
  const options = {
    method: 'POST',
    url: 'https://scl-sandbox.dev.clover.com/v1/orders',
    headers,
    body: {
      'currency': 'USD',
      'email': req.body.email,
      'items': lineItems,
      'shipping': {
        'address': {
          'city': req.body.city,
          'country': req.body.country,
          'line1': req.body.line1,
          'line2': req.body.line2,
          'postal_code': req.body.postal_code,
          'state': req.body.state,
        },
        'name': req.body.name,
      },
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    orderId = body.id;
  });
});

// When user goes to the Payment page, grab the Merchant Key.
app.get('/merchantKey', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://apisandbox.dev.clover.com/pakms/apikey',
    headers,
  };

  // Let the Payment page grab the Merchant Key.
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    res.send(body);
  });
});

// When user clicks PLACE ORDER -> Use the token to pay for the order.
app.post('/pay-order', (req, res) => {
  const options = {
    method: 'POST',
    url: `https://scl-sandbox.dev.clover.com/v1/orders/${orderId}/pay`,
    headers,
    body: {
      'source': req.body.token,
    },
    json: true,
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
