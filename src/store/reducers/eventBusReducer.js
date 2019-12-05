import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function eventBusReducer(state = initialState.eventBus, action) {  
    switch(action.type) {
        case types.SET_EVENTBUS:
            return {
                ...state,
                eventBus: action.eventBus
	    }
        default: 
            return { ...state }
   }
}
