import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import theme from "./themes/cokiTheme";
import App from './components/App';
import EventBus from 'vertx3-eventbus-client';
import { setEventBus } from './store/actions/eventBusActions';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebase/firebase'
//import { eventBus } from './config';

const store = configureStore();
// connect to the verticle middleware web socket event bus
var eventBus = new EventBus('http://chorographica.canterbury.ac.nz:8081/eventbus');
eventBus.enableReconnect(true);
eventBus.onerror = (e) => {
    console.log(e);
};
eventBus.onopen = () => {
    store.dispatch(setEventBus(eventBus));
};

const rrfConfig = {
    userProfile: "users",
    useFirestoreForProfile: true,
};

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance, 
};

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <App />
            </ReactReduxFirebaseProvider>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
