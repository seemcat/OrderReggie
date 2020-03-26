import React, { Component } from 'react';
import './Menu.css';
import {Link} from 'react-router-dom';

class Checkout extends Component {
  constructor() { 
    super();
    this.state = {
      name: '',
      email: '',
      city: '',
      country: '',
      line1: '', // Street Address
      line2: '', // Apt/Suite/Other
      postal_code: '', // Zip Code
      state: '',
    }
  }

  onChange(e, val) {
    this.setState({ [e.target.id]: e.target.value });
  }

  // PROCEED TO PAYMENT -> Create an order.
  createOrder() {
    fetch('http://localhost:3030/create-order', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(this.state)
    });
  }

  render() {
    return (
      <div className="Menu">
        <header className="Menu-header">
          <p>
            ORDER REGGIE
          </p>
        </header>
        <div className="Checkout">
          <div className="Shipping-list">

            <div className="md-form">
              <input type="text" id="name" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="name">Name</label>
            </div>
            <div className="md-form">
              <input type="text" id="email" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="email">Email</label>
            </div>

            <div className="md-form">
              <input type="text" id="country" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="country">Country</label>
            </div>
            <div className="md-form">
              <input type="text" id="line1" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="line1">Street Address</label>
            </div>
            <div className="md-form">
              <input type="text" id="line2" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="line2">Apt/Suite/Other</label>
            </div>
            <div className="md-form">
              <input type="text" id="postal_code" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="postal_code">Zip Code</label>
            </div>
            <div className="md-form">
              <input type="text" id="city" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="city">City</label>
            </div>
            <div className="md-form">
              <input type="text" id="state" className="form-control" onChange={(e) => this.onChange(e)}/>
              <label for="state">State</label>
            </div>
          </div>
        </div>

        <div className="Menu-checkout">
          <Link to='/payment'>
            <button type="button" className="btn btn-dark" onClick={ () => this.createOrder() }>PROCEED TO PAYMENT</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Checkout;
