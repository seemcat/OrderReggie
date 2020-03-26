import React, { Component } from 'react';
import './Menu.css';
import { withRouter } from 'react-router-dom';

class Payment extends Component {
  constructor() { 
    super();
    this.state = {
      amount: null,
    }
  }

  componentDidMount() {
    // Get the Merchant Key.
    fetch('http://localhost:3030/merchantKey')
      .then((res) => res.json())
      .then((data) => {
        // Load the Clover E-Commerce SDK
        const script = document.createElement('script');
        script.src = "https://checkout.sandbox.dev.clover.com/sdk.js";
        script.async = true;
        script.onload = () => this.scriptLoaded(data.apiAccessKey);
        document.body.appendChild(script);
      });
  }

  scriptLoaded(apiAccessKey) {
    // Set payments client.
    const clover = new window.Clover(apiAccessKey);
    const elements = clover.elements();
    const styles = {
      body: {
        fontFamily: 'Roboto, Open Sans, sans-serif',
        fontSize: '16px',
      },
      input: {
        fontSize: '16px',
      },
    };

    const cardNumber = elements.create('CARD_NUMBER', styles);
    const cardDate = elements.create('CARD_DATE', styles);
    const cardCvv = elements.create('CARD_CVV', styles);
    const cardPostalCode = elements.create('CARD_POSTAL_CODE', styles);
    cardNumber.mount('#card-number');
    cardDate.mount('#card-date');
    cardCvv.mount('#card-cvv');
    cardPostalCode.mount('#card-postal-code');
    const displayError = document.getElementById('card-errors');

    // Handle real-time validation errors from the card Element.
    cardNumber.addEventListener('change', (event) => {
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    cardDate.addEventListener('change', (event) => {
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    cardCvv.addEventListener('change', (event) => {
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    cardPostalCode.addEventListener('change', (event) => {
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      clover.createToken()
        .then((result: any) => {
          if (result.errors) {
            Object.values(result.errors).forEach((value) => {
              console.log('Error generating token: ', value);
            });
          } else {
            fetch('http://localhost:3030/pay-order', {
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(result),
            })
              .then((res) => {
              return res.json();
              })
              .then((data) => {
                if (data.success) {
                  const { history } = this.props;
                  history.push('/OrderConfirmation');
                }
                else console.log('Payment failed.');
            });
          }
        });
    });
  }

  render() {

    return (
      <div className="Menu">
        <header className="Menu-header">
          <p>
            The Plant Store
          </p>
        </header>
        <div className="Menu-list">
          <form action="/charges" method="post" id="payment-form" className="Form">
            <div className="form-row top-row">
              <div id="card-number" className="field card-number"></div>
            </div>
            <div className="form-row">
              <div id="card-date" className="field third-width"></div>
              <div id="card-cvv" className="field third-width"></div>
              <div id="card-postal-code" className="field third-width"></div>
            </div>
            <div id="card-errors" role="alert" className="Errors"></div>
            <div className="button-container Menu-checkout">
              <input type="submit" value="PLACE ORDER" className="btn btn-dark"/>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Payment);
