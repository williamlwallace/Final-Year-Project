import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from "./themes/cokiTheme";
import App from './components/App';
import EventBus from 'vertx3-eventbus-client';
import { setEventBus } from './store/actions/eventBusActions';
//import { eventBus } from './config';

const store = configureStore();
// connect to the verticle middleware web socket event bus
var eventBus = new EventBus('http://localhost:8080/eventbus');
eventBus.enableReconnect(true);
eventBus.onerror = (e) => {
    console.log(e);
};
eventBus.onopen = () => {
    store.dispatch(setEventBus(eventBus));
};

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <App />
            </SnackbarProvider>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
