import * as types from './actionTypes'
import { myFirebase } from "../../firebase/firebase";
import { getFirestore } from 'redux-firestore';
 
const requestLogin = () => {
    return {
        type: types.LOGIN_REQUEST
    }
}

const receiveLogin = () => {
    return {
        type: types.LOGIN_SUCCESS
    }
}

const loginError = () => {
    return {
        type: types.LOGIN_FAILURE
    }
}

const requestLogout = () => {
    return {
        type: types.LOGOUT_REQUEST
    }
}

const receiveLogout = () => {
    return {
        type: types.LOGOUT_SUCCESS
    }
}

const logoutError = () => {
    return {
        type: types.LOGOUT_FAILURE
    }
}

const verifyRequest = () => {
    return {
        type: types.VERIFY_REQUEST
    }
}

const verifySuccess = () => {
    return {
        type: types.VERIFY_SUCCESS
    }
}

const requestCreateUser = () => {
    return {
        type: types.CREATE_USER_REQUEST
    }
}

const receiveCreateUser = () => {
    return {
        type: types.CREATE_USER_SUCCESS
    }
}

const createUserError = () => {
    return {
        type: types.CREATE_USER_FAILURE
    }
}

const requestUpdateUser = () => {
    return {
        type: types.UPDATE_USER_REQUEST
    }
}

const receiveUpdateUser = () => {
    return {
        type: types.UPDATE_USER_SUCCESS
    }
}

const updateUserError = () => {
    return {
        type: types.UPDATE_USER_FAILURE
    }
}

export const loginUser = (email, password) => dispatch => {
    dispatch(requestLogin());
    myFirebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(receiveLogin(user));
      })
      .catch(error => {
        dispatch(loginError());
      });
  };
  
  export const logoutUser = () => dispatch => {
    dispatch(requestLogout());
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(receiveLogout());
      })
      .catch(error => {
        dispatch(logoutError());
      });
  };
  
  export const verifyAuth = () => dispatch => {
    dispatch(verifyRequest());
    myFirebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        dispatch(receiveLogin(user));
      }
      dispatch(verifySuccess());
    });
  };

  export const createUser = (first, last, email, password) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        dispatch(requestCreateUser());
        myFirebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(response => {
                return firestore.collection('users').doc(response.user.uid).set({
                    firstName: first,
                    lastName: last,
                    initials: first[0] + last[0]
                })
            }).then(
            
            user => {
                dispatch(receiveCreateUser(user))

            })
            .catch(error => {
                dispatch(createUserError())
            })
    }
  };

  export const updateUser = (first, last) => {
      console.log(first, last)
      return (dispatch, getState, {getFirebase, getFirestore}) => {
            const firebase = getFirebase();
            const firestore = getFirestore();
            dispatch(requestUpdateUser());
            firestore.collection('users').doc(myFirebase.auth().currentUser.uid).update({
                firstName: first,
                lastName: last
            }).then(
                dispatch(receiveUpdateUser())
            ).catch(error => {
                dispatch(updateUserError())
            })
          
      }
  }
