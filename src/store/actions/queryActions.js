import { eventBus, firebaseAuth } from '../../config';
import * as types from './actionTypes'
import { myFirebase } from "../../firebase/firebase";
// TODO: Top-k doi search cache

export function setInstitutionYearSearchResult(institutionYearSearchResult) {
    return {
        type : types.SET_INSTITUTION_YEAR_SEARCH_RESULT,
        institutionYearSearchResult
    }
}

export function setDOISearchResult(doiSearchResult) {
    return {
        type : types.SET_DOI_SEARCH_RESULT,
        doiSearchResult
    }
}

export function doInstitutionYearKeywordSearch() {
    return function (dispatch, getState) {
        let query = getState().searchField.value;
        let eb = getState().eventBus.eventBus;
        if (!(query && eb)) {
            // You don't have to return Promises, but it's a handy convention
            // so the caller can always call .then() on async dispatch result.
            console.log("clear the query");
            dispatch(setInstitutionYearSearchResult({
                "type" : "FeatureCollection",
                "features" : []
            }));
            return Promise.resolve();
	}

        let payload = { 
            "query" : query,
            //"size" : 10000
        };
        eb.send('InstitutionYear.Query', payload, (response, json) => {
            if (json.body) {
                dispatch(setInstitutionYearSearchResult(json.body));
            } else {
                dispatch(setInstitutionYearSearchResult({
                    "type" : "FeatureCollection",
                    "features" : []
                }));
	    }
        });
        return Promise.resolve();
    }
}

export function doDOISearch(grid_id) {
    return function (dispatch, getState, {getFirebase, getFirestore}) {
        let query = getState().searchField.value;
        let eb = getState().eventBus.eventBus;
        let auth = !getState().firebase.auth.isEmpty;
        const firebase = getFirebase();
        const firestore = getFirestore();

        // Adds search query to user's search history only if they are logged in and authenticated
        if (auth) {
            firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
                searchHistory: firebase.firestore.FieldValue.arrayUnion(query)
            });
        }

        if (!(query && grid_id && eb)) {
            // You don't have to return Promises, but it's a handy convention
            // so the caller can always call .then() on async dispatch result.
            //console.log("clear the query");

            dispatch(setDOISearchResult({
                "max_score" : 0,
                "total" : 0,
                "results" : null,
                "query" : "",
                "errorCode" : 100
            }));
            return Promise.resolve();
	    }

        let yearMinimum = getState().timeline.selectionStart;
        if (!yearMinimum) yearMinimum = 0;
        let yearMaximum = getState().timeline.selectionEnd;
        if (!yearMaximum) yearMaximum = 2020;
        let payload = { 
            "query" : query,
            "grid_id" : grid_id,
            "size" : 50,
            "year_minimum" : yearMinimum,
            "year_maximum" : yearMaximum
        };
        eb.send('DOI.Query', payload, (response, json) => {
            if (json.body) {
                dispatch(setDOISearchResult(json.body));
            } else {
                dispatch(setDOISearchResult({
                    "max_score" : 0,
                    "total" : 0,
                    "results" : null,
                    "query" : "",
                    "errorCode" : 100
                }));
            }
        });
        return Promise.resolve();
    }
    
}
