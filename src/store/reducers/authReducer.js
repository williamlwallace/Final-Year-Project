import * as types from '../actions/actionTypes';  
import initState from '../init'

export default function authReducer(state, action) {
    if (action.type === types.USER_LOGOUT) {
        return initState;
    }
    return { ...state }
}
