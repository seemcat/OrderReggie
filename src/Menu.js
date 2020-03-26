import React, { Component } from 'react';
import './Menu.css';
import {Link} from 'react-router-dom'

class Menu extends Component {
  constructor() { 
    super();
    this.state = {
      total: 0,
      inventory: [],
    }
  }

  componentDidMount() {
    fetch('http://localhost:3030/inventory')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ 'inventory': data.elements });
        const selectedItems = new Array(data.elements.length);
        this.setState({ selectedItems });
      });
  }

  toggleItem(e, item) {
    const selectedItems = this.state.selectedItems;
    const idx = e.target.value;

    // De-select item
    if (selectedItems[idx]) {
      selectedItems[idx] = null;
      this.setState({ selectedItems });
    } else {
      // Select item
      selectedItems[idx] = item;
      this.setState({ selectedItems });
    }
  }

  // CHECKOUT -> Open an order, send items selected to server.
  saveOrder() {
    const listOfItems = [];

    this.state.selectedItems.forEach((item) => {
      if (item) {
        item.amount = item.price;
        item.quantity = 1;
        item.description = item.name;
        listOfItems.push(item);
      }
    });

    fetch('http://localhost:3030/save-order', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(listOfItems)
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
        <div className="Menu-list">
          <div>
            {  this.state.inventory.map((item, idx) => {
              let price = item.price / 100;
              price = price.toLocaleString("en-US", {style:"currency", currency:"USD"});

              return (
                <div key={idx}>
                  <input type="checkbox" className="Menu-option" name={item.name} value={idx} onClick={ (e) => this.toggleItem(e, item) }/>
                  {item.name}: {price}
                </div>
              )
            }) }
            <div className="Menu-checkout">
        <Link to='/checkout'>
          <button type="button" className="btn btn-dark" onClick={ () => this.saveOrder() }>CHECKOUT</button>
        </Link>
      </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
