import { firebaseRef, firebaseAuth } from '../config.js'

export function auth (email, pw) {
    return firebaseAuth().createUserWithEmailAndPassword(email, pw).then(saveUser);
}

export function logout () {
    return firebaseAuth().signOut();
}

export function login (email, pw) {
    return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword (email) {
    return firebaseAuth().sendPasswordResetEmail(email);
}

export function saveUser (user) {
    user.sendEmailVerification();
    return firebaseRef.child(`users/${user.uid}/info`).set({
        email: user.email,
        uid: user.uid
    }).then(() => user);
}
