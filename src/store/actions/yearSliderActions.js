import * as types from './actionTypes'

export function setYearSliderSelectionStart(selectionStart) {
    return {
        type: types.SET_YEAR_SLIDER_SELECTION_START,
        selectionStart
    }
}

export function setYearSliderSelectionEnd(selectionEnd) {
    return {
        type: types.SET_YEAR_SLIDER_SELECTION_END,
        selectionEnd
    }
}

