import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function yearSliderReducer(state = initialState.yearSlider, action) {  
    switch(action.type) {
        case types.SET_YEAR_SLIDER_SELECTION_START:
            return {
                ...state,
                selectionStart: action.selectionStart
	    }
        case types.SET_YEAR_SLIDER_SELECTION_END:
            return {
                ...state,
                selectionEnd: action.selectionEnd
	    }
        default: 
            return { ...state }
   }
}
