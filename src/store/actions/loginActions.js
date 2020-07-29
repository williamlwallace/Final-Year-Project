import * as types from './actionTypes'

export function showLoginDialog() {
    return {
        type: types.SHOW_LOGIN_DIALOG
    }
}

export function hideLoginDialog() {
    return({
        type: types.HIDE_LOGIN_DIALOG
    })
}