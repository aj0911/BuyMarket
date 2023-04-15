import {createReducer} from '@reduxjs/toolkit'

const initialState = {
    isAuth:false
}

export const Auth =  createReducer(initialState,{
        login:(state,action)=>{
            state.isAuth = true
            state.user = action.payload;
        },
        register:(state,action)=>{
            state.isAuth = true
            state.user = action.payload;
        },
        logout:(state)=>{
            state.isAuth = false
            state.user = null
        }
})
