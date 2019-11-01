import firebase from 'firebase'
import EventBus from 'vertx3-eventbus-client';

const config = {
    firebase_config_dev: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
    },
    firebase_config: {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
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
        locale: 'en'
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
const eventBus = new EventBus('http://localhost:8080/eventbus');
eventBus.enableReconnect(true);
console.log(eventBus);
export { eventBus };

export default config
