import { configureStore } from "@reduxjs/toolkit";
//Slices
import userAuthSlice from './userAuth-slice'; 

const store = configureStore({
  reducer:{
    userAuth: userAuthSlice.reducer
  }
}); 

export const userLoginActions = userAuthSlice.actions; 
export default store; 