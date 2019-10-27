import * as types from './actionTypes'

export function setMapPickedGridId(pickedGridId) {
    return {
        type: types.SET_MAP_PICKED_GRID_ID,
        pickedGridId
    }
}

export function setOrToggleMapSelectedGridId(selectedGridId) {
    return (dispatch, getState) => {
        const { map } = getState();
        const { selectedGridId } = map;

        if (selectedHexCell === cell) {
            dispatch ({
                type: types.SET_OR_TOGGLE_MAP_SELECTED_GRID_ID,
                selectedGridId: null
            });
        } else {
            dispatch ({
                type: types.SET_OR_TOGGLE_MAP_SELECTED_GRID_ID,
                selectedGridId
            });
        }
    }
}

export function setMapBounds(bounds) {
    return {
        type: types.SET_MAP_BOUNDS,
        bounds
    }
}

export function setMapZoom(zoom) {
    return {
        type: types.SET_MAP_ZOOM,
        zoom
    }
}
