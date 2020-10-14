import firebase from 'firebase'
import EventBus from 'vertx3-eventbus-client';
import { doInstitutionYearKeywordSearch } from './store/actions/queryActions';

const config = {
    firebase_config_dev: {
        apiKey: "AIzaSyCAeCyt2mH10ze_LezGzc8h3nF6feakyLo",
        authDomain: "coki-explorer.firebaseapp.com",
        databaseURL: "https://coki-explorer.firebaseio.com",
        projectId: "coki-explorer",
        storageBucket: "coki-explorer.appspot.com",
        messagingSenderId: "1009140869228",
        appId: "1:1009140869228:web:24d57b1a6b91c74a5c9049",
        measurementId: "G-YRKJ3E1Q6N"
    },
    firebase_config: {
        apiKey: "AIzaSyCAeCyt2mH10ze_LezGzc8h3nF6feakyLo",
        authDomain: "coki-explorer.firebaseapp.com",
        databaseURL: "https://coki-explorer.firebaseio.com",
        projectId: "coki-explorer",
        storageBucket: "coki-explorer.appspot.com",
        messagingSenderId: "1009140869228",
        appId: "1:1009140869228:web:24d57b1a6b91c74a5c9049",
        measurementId: "G-YRKJ3E1Q6N"
    },
    firebase_providers: [
        'google.com',
        'facebook.com',
        'twitter.com',
        'github.com',
        'password',
        'phone'
    ],
    initial_state: {
    },
    drawer_width: 256
}

// config firebase
/**
export const firebaseApp = firebase.initializeApp(config.firebase_config_dev);
export const firebaseRef = firebase.database().ref();
export const firebaseAuth = firebase.auth;
**/

// connect to the verticle middleware web socket event bus
//var eventBus = new EventBus('http://localhost:8080/eventbus');
//eventBus.enableReconnect(true);
//eventBus.onerror = (e) => {
//    console.log(e);
//};
//eventBus.onopen = () => {
//    return eventBus;
//};
//export { eventBus };

export default config
