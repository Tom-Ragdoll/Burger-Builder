import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    ingredients: null,
    totalPrice: 2.99,
    error: false,
    building: false
};

const INGREDIENT_PRICES = {
    salad: 0.49,
    cheese: 0.79,
    meat: 1.49,
    bacon: 0.99
};

const updateAmount = (state, action, addition=true) => {
    let newAmount, newPrice;
    if (addition) {
        newAmount = state.ingredients[action.ingredientName] + 1;
        newPrice = state.totalPrice + INGREDIENT_PRICES[action.ingredientName];
    } else {
        newAmount = state.ingredients[action.ingredientName] - 1;
        newPrice = state.totalPrice - INGREDIENT_PRICES[action.ingredientName];
    }
    const updatedIngredients = updateObject(state.ingredients, {[action.ingredientName]: newAmount})
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: newPrice,
        building: true
    };
    return updateObject(state, updatedState);
};

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: action.ingredients,
        error: false,
        totalPrice: 4,
        building: false
    });
};

const fetchIngredients = state => {
    return updateObject(state, {error: true});
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return updateAmount(state, action);
        case actionTypes.REMOVE_INGREDIENT: return updateAmount(state, action, false);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredients(state);
        default: break;      
    };
    return state; 
};

export default reducer;