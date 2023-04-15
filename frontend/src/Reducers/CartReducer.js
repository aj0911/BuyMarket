import { createReducer } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = []

export const cartReducer = createReducer(initialState,{
    addToCart:(state,action)=>{ 
        const {user,cart} = action.payload;
        let sameItem = false;
        let sameUser = false;
        state.forEach((x)=>{
            if(x.user._id ===user._id){
                x.cart.forEach((y,i)=>{
                    if(y.product.id === cart.product.id){
                        x.cart[i] = {
                            product:cart.product,
                            quantity:x.cart[i].quantity +1
                        }
                        sameItem = true;
                        return;
                    }
                })
                if(!sameItem){
                    x.cart.push({
                        product:cart.product,
                        quantity:cart.quantity
                    })
                }
                sameUser = true;
                return;
            }
        })
        if(!sameUser){
           state.push({
            user,
            cart:[{
                product:cart.product,
                quantity:cart.quantity
            }]
           })
        }
    },
    removeFromCart:(state,action)=>{
        const {user,product} = action.payload;
        state.forEach((x,j)=>{
            if(x.user._id ===user._id){
                x.cart.forEach((y,i)=>{
                    if(y.product.id ===product.id){
                        if(y.quantity ===1){
                            x.cart.splice(i,1);
                        }
                        else{
                            x.cart[i] = {
                                product,
                                quantity:x.cart[i].quantity-1
                            }
                        }
                    }
                })
            }
        })
    },
    removeWholeItem:(state,action)=>{
        const {user,product} = action.payload;
        state.forEach((x,j)=>{
            if(x.user._id ===user._id){
                x.cart.forEach((y,i)=>{
                    if(y.product.id ===product.id){
                        x.cart.splice(i,1);
                    }
                })
            }
        })
    },
    emptyCart:(state,action)=>{
        state.forEach((x,i)=>{
            action.payload.orderItems.forEach((y,j)=>{
                x.cart.forEach((element,index)=>{
                    if(element.id === y._id){
                        x.cart.splice(index,1);
                    }
                })
            })
            
        })
        state.forEach((x,i)=>{
            if(x.user._id ===action.payload.user._id){
                state.splice(i,1);
            }
        })
    },
    deleteUserCart:(state,action)=>{
        state.forEach((x,i)=>{
            if(x.user._id ===action.payload.user_id){
                state.splice(i,1);
            }
        })
    },
    empty:(state)=>{
        state.pop();
    }
})
