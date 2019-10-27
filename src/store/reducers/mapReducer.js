import * as types from '../actions/actionTypes';  
import initialState from '../initialState';

export default function mapReducer(state = initialState.map, action) {  
    switch(action.type) {
        case types.SET_MAP_PICKED_GRID_ID:
            return {
                ...state,
		pickedGridId: action.pickedGridId
	    }
        case types.SET_OR_TOGGLE_MAP_SELECTED_GRID_ID:
           // Set the selected cell to action.cell
            return {
                ...state,
                selectedGridId: action.selectedGridId
            }
        case types.SET_MAP_BOUNDS:
            return {
                ...state,
                bounds: action.bounds
            }
        case types.SET_MAP_ZOOM:
            return {
                ...state,
                zoom: action.zoom
	    }
        default:
            return { ...state }
    }
}
