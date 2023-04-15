import {  combineReducers, configureStore } from "@reduxjs/toolkit";
import {Auth} from "./Reducers/Auth";
import {persistReducer} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { cartReducer } from "./Reducers/CartReducer";


const rootReducer = combineReducers({
    auth:Auth,
    cart:cartReducer
})

const store = configureStore({
    reducer:persistReducer({
        key:'root',
        version:1,
        storage
    },rootReducer)
})

export default store;