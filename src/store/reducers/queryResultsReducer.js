import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function queryResultsReducer(state = initialState.queryResults, action) {  
    switch(action.type) {
        case types.SET_INSTITUTION_YEAR_SEARCH_RESULT:
            return {
                ...state,
                institutionYearSearchResult: action.institutionYearSearchResult
            }
        case types.SET_DOI_SEARCH_RESULT:
            return {
                ...state,
                doiSearchResult: action.doiSearchResult
            }
        default: 
            return { ...state }
    }
}
