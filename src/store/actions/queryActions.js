import { eventBus, firebaseAuth } from '../../config';
import * as types from './actionTypes'
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
        let query = getState().input.searchFieldValue;
        if (!query) {
            // You don't have to return Promises, but it's a handy convention
            // so the caller can always call .then() on async dispatch result.
            console.log("clear the query");
            return Promise.resolve();
	}
    }

    const eb = eventBus;
    let payload = { 
        "query" : "quantum computing",
        "sizr" : 10
    };
    eb.send('InstitutionYear.Query', payload, (response, json) => {
        if (json.body) {
            console.log(json.body);
            dispatch(setInstitutionYearSearchResult(json.body));
	}
    }
}

export function doDOIQuery() {
    
}
