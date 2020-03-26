import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Menu from './Menu';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Checkout from './Checkout';
import Payment from './Payment';
import OrderConfirmation from './OrderConfirmation';

class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={Menu} />
            <Route exact path='/checkout' component={Checkout} />
            <Route exact path='/payment' component={Payment} />
            <Route exact path='/orderConfirmation' component={OrderConfirmation} />
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<AppRouter />, document.getElementById('root'));
