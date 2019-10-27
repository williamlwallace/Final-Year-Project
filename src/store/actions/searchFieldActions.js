import * as types from './actionTypes'

export function setSearchFieldValue(value) {
    return {
        type: types.SET_SEARCH_FIELD_VALUE,
        value
    }
}

/***
export function selectGridId(grid_id) {
    return {
        type: types.SELECT_GRID_ID,
        grid_id
    }
}

export function setGridIdIsPinned(bool) {
    return {
        type: types.SET_GRID_ID_IS_PINNED,
        bool
    }
}

export function setHoveredGridId(grid_id) {
    return {
        type: types.SET_HOVERED_GRID_ID,
        grid_id
    }
}
***/
