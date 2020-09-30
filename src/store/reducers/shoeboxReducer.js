import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function shoeboxReducer(state = initialState.shoebox, action) {
    switch(action.type) {
        case types.UPDATE_SHOEBOX_REQUEST:
            return {
                ...state,
        }
        case types.UPDATE_SHOEBOX_SUCCESS:
            return {
                ...state,
        }
        case types.UPDATE_SHOEBOX_FAILURE:
            return {
                ...state,
        };
        default:
            return {...state}
    }
}