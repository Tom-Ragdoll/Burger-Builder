import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga';
import axios from 'axios';

import * as authActions from '../actions/';

export function* logoutSaga() {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put(authActions.logoutSucceed());
};

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(authActions.logoutInit());
};

export function* authUserSaga(action) {
    yield put(authActions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };


    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB6eKTtD6MoboAr4xAmI1bZMYAakZpIAic';
    if(!action.isSignup) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB6eKTtD6MoboAr4xAmI1bZMYAakZpIAic';
    };

    try {
        const res = yield axios.post(url, authData)
        const expirationDate = yield new Date(new Date().getTime() + res.data.expiresIn*1000);
        yield localStorage.setItem('token', res.data.idToken);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userId', res.data.localId);
        yield put(authActions.authSuccess(res.data.idToken, res.data.localId));
        yield put(authActions.checkAuthTimeout(res.data.expiresIn));
    } catch(err) {
        yield put(authActions.authFail(err.response.data.error));
    };
};

export function* authCheckStateSaga() {
    const token = yield localStorage.getItem('token');
    if(!token) {
        yield put(authActions.logoutInit());
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
        if (expirationDate < new Date()){
            yield put(authActions.logoutInit());
        } else {
            const userId = yield localStorage.getItem('userId');
            yield put(authActions.authSuccess(token, userId));
            yield put(authActions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
        };
    };
};