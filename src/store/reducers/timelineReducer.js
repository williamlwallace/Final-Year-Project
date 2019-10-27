import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function timelineReducer(state = initialState.timeline, action) {  
    switch(action.type) {
        case types.SET_TIMELINE_SELECTION_START:
            return {
                ...state,
                selectionStart: action.selectionStart
	    }
        case types.SET_TIMELINE_SELECTION_END:
            return {
                ...state,
                selectionEnd: action.selectionEnd
	    }
        case types.SET_TIMELINE_YEAR_FOCUS:
            return {
                ...state,
                yearFocus: action.yearFocus
	    }
        default: 
            return { ...state }
   }
}
