import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function authReducer(state = initialState.auth, action) {
    switch(action.type) {
        case types.LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false
        }
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user
        }
        case types.LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
                loginError: true
        };
        case types.LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
                logoutError: false
        }
        case types.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: false,
                user: {}
        }
        case types.LOGOUT_FAILURE:
            return {
                ...state,
                isLoggingOut: false,
                logoutError: true
        }
        case types.VERIFY_REQUEST:
            return {
                ...state,
                isVerifying: true,
                verifyingError: false
        }
        case types.VERIFY_SUCCESS:
            return {
                ...state,
                isVerifying: false
        }
        case types.CREATE_USER_REQUEST:
            return {
                ...state,
                isCreatingUser: true,
                createUserError: false,
        }
        case types.CREATE_USER_SUCCESS:
            return {
                ...state,
                isCreatingUser: false,
                isAuthenticated: true,
                user: action.user
        }
        case types.CREATE_USER_FAILURE:
            return {
                ...state,
                isCreatingUser: false,
                isAuthenticated: false,
                createUserError: true
        };
        default:
            return state
    }
}
