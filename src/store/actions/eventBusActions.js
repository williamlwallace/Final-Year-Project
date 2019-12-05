import * as types from './actionTypes'

export function setEventBus(eventBus) {
    return {
        type: types.SET_EVENTBUS,
        eventBus
    }
}

