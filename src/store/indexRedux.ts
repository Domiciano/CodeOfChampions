import { configureStore } from "@reduxjs/toolkit";
//Slices
import userAuthSlice from './userAuth-slice'; 
import classSlice from './class-slice';

const store = configureStore({
  reducer:{
    userAuth: userAuthSlice.reducer,
    classSlice: classSlice.reducer
  }
}); 

export const userLoginActions = userAuthSlice.actions; 
export const classSliceActions = classSlice.actions; 
export default store; 