import * as types from './actionTypes'

export function setTimelineSelectionStart(selectionStart) {
    return {
        type: types.SET_TIMELINE_SELECTION_START,
        selectionStart
    }
}

export function setTimelineSelectionEnd(selectionEnd) {
    return {
        type: types.SET_TIMELINE_SELECTION_END,
        selectionEnd
    }
}

export function setTimelineYearFocus(yearFocus) {
    return {
        type: types.SET_TIMELINE_YEAR_FOCUS,
        yearFocus
    }
}
