import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function loginReducer(state = initialState.loginDialog, action) {  
    switch(action.type) {
        case types.SHOW_LOGIN_DIALOG:
	    return {
                ...state,
                value: action.value
            }
        case types.HIDE_LOGIN_DIALOG:
            return initialState
        default: 
            return { ...state }
    }
}
