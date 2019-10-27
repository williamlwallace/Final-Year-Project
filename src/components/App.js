import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../images/logo.svg';
import './App.css';
import Home from './Home';
import Foo from './Foo';
import Bar from './Bar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path="/" component={Home} />
                <Route path="/foo" component={Foo} />
                <Route path="/bar" component={Bar} />    
            </Router>
	);
    }
}
const mapStateToProps = (state) => {
   return { };
};

export default connect(mapStateToProps, { } )(App);

