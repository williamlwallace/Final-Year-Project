import * as types from './actionTypes'
import { myFirebase } from "../../firebase/firebase";
import { getFirestore } from 'redux-firestore';

const requestUpdateShoebox = () => {
    return {
        type: types.UPDATE_SHOEBOX_REQUEST
    }
}

const receiveUpdateShoebox = () => {
    return {
        type: types.UPDATE_SHOEBOX_SUCCESS
    }
}

const updateShoeboxError = () => {
    return {
        type: types.UPDATE_SHOEBOX_FAILURE
    }
}

const requestDeleteShoeboxItem = () => {
    return {
        type: types.DELETE_SHOEBOX_REQUEST
    }
}

const receiveDeleteShoeboxItem = () => {
    return {
        type: types.DELETE_SHOEBOX_SUCCESS
    }
}

const deleteShoeboxItemError = () => {
    return {
        type: types.DELETE_SHOEBOX_FAILURE
    }
}

const requestUpdateShoeboxItemNotes = () => {
    return {
        type: types.UPDATE_NOTES_REQUEST
    }
}

const receiveUpdateShoeboxItemNotes = () => {
    return {
        type: types.UPDATE_NOTES_SUCCESS
    }
}

const updateShoeboxItemNotesError = () => {
    return {
        type: types.UPDATE_NOTES_FAILURE
    }
}

export const updateShoebox = (source) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        let query = getState().searchField.value;
        let gridId = getState().queryResults.doiSearchResult.grid_id;
        const firestore = getFirestore();
        const firebase = getFirebase();
        dispatch(requestUpdateShoebox);
        firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
            shoebox: firebase.firestore.FieldValue.arrayUnion({
                title: source.title,
                authors: source.authors,
                query: query,
                gridId: gridId,
                doi: source.doi,
                notes: ""
            })
        }).then(
            dispatch(receiveUpdateShoebox())
        ).catch(error => {
            dispatch(updateShoeboxError())
        })
    }
}

export const updateShoeboxItemNotes = (index, notes) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        console.log(index, notes)
        const ref = firestore.collection('users').doc(myFirebase.auth().currentUser.uid);
        ref.get().then(doc => {
            const shoeboxArray = doc.data().shoebox
            shoeboxArray[index].notes = notes
            ref.update({
                shoebox: shoeboxArray
            }).then(
                dispatch(receiveUpdateShoeboxItemNotes())
            ).catch(error => {
                dispatch(updateShoeboxItemNotesError())
            })
        })
        
    }
}

export const deleteShoeboxItem = (index) => { 
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        dispatch(requestDeleteShoeboxItem())
        const ref = firestore.collection('users').doc(myFirebase.auth().currentUser.uid);
        ref.get().then(doc => {
            const shoeboxArray = doc.data().shoebox;
            shoeboxArray.splice(index, 1);
            ref.update({
                shoebox: shoeboxArray
           }).then(
               dispatch(receiveDeleteShoeboxItem())
           ).catch(error => {
               dispatch(deleteShoeboxItemError())
           })
        })
        
        
    }
}
