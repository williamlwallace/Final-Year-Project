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

export const updateShoebox = (source) => {
    console.log('1')
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        console.log('2')
        let query = getState().searchField.value;
        let gridId = getState().queryResults.doiSearchResult.grid_id;
        const firestore = getFirestore();
        const firebase = getFirebase();
        dispatch(requestUpdateShoebox);
        firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
            shoeBox: myFirebase.firestore.FieldValue.arrayUnion(source.title)
                // authors: "source.authors",
                // query: query,
                // gridId: gridId,
                // notes: "",   
        }).then(
            dispatch(receiveUpdateShoebox())
        ).catch(error => {
            dispatch(updateShoeboxError)
        })
    }
}

// firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
        //     searchHistory: firebase.firestore.FieldValue.arrayUnion(query)
        // })

// export const updateUser = (first, last) => {
//     return (dispatch, getState, {getFirebase, getFirestore}) => {
//           const firebase = getFirebase();
//           const firestore = getFirestore();
//           dispatch(requestUpdateUser());
//           firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
//               firstName: first,
//               lastName: last
//           }).then(
//               dispatch(receiveUpdateUser())
//           ).catch(error => {
//               dispatch(updateUserError())
//           })
        
//     }
// }

