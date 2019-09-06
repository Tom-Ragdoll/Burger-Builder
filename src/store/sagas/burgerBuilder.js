import { put } from 'redux-saga/effects';
import axios from "../../axios-orders";

import * as burgerActions from '../actions/';

export function* initIngredientsSaga() {
    try {
        const res = yield axios.get('/ingredients.json');
        let ingredients ={}
        ingredients["salad"]=res.data["salad"]
        ingredients["bacon"]=res.data["bacon"]
        ingredients["cheese"]=res.data["cheese"]
        ingredients["meat"]=res.data["meat"]
        yield put(burgerActions.setIngredients(ingredients));
    } catch (err) {
        yield put(burgerActions.fetchIngredientsFailed());
    }
};