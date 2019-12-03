import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path="/" component={Home} />
            </Router>
	);
    }
}
const mapStateToProps = (state) => {
   return { };
};

export default connect(mapStateToProps, { } )(App);

