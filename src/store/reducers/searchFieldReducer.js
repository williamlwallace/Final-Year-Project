import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function searchFieldReducer(state = initialState.searchField, action) {  
    switch(action.type) {
        case types.SET_SEARCH_FIELD_VALUE:
	    return {
                ...state,
                value: action.value
            }
        default: 
            return { ...state }
    }
}
