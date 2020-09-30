import {combineReducers} from 'redux';  
import appLayout from './appLayoutReducer';
import searchField from './searchFieldReducer';
import map from './mapReducer';
import queryResults from './queryResultsReducer';
import timeline from './timelineReducer';
import yearSlider from './yearSliderReducer';
import auth from './authReducer';
import eventBus from './eventBusReducer';
import shoeboxReducer from './shoeboxReducer'
import { connectRouter } from 'connected-react-router';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

export default (history) => combineReducers({
    // short hand property names
    router: connectRouter(history),
    auth,
    appLayout,
    searchField,
    map,
    queryResults,
    timeline,
    yearSlider,
    eventBus,
    firebase: firebaseReducer,
    firestore: firestoreReducer,
    shoebox: shoeboxReducer
})

