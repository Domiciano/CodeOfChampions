import React, { useEffect } from 'react';
import { StudentType, TeacherType } from "../../types/user";
import LogOut from '../../components/LogOut/LogOut';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOnAuthState, userAuthInitStateType } from '../../store/userAuth-slice';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';

const Home = () => {
  const loggedUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  
  function isTeacherType(obj: any): obj is TeacherType {
    return obj.isVerified !== undefined 
  }

  useEffect(() => {
    console.log(isFetchingCurrentUser)
    if(!isFetchingCurrentUser){
      console.log('AAA', isLoggedIn)
      // * At this moment, the fetch process is finished
      // TODO: Check if there is a user login
      if(!isLoggedIn){
        navigate("/login");
        console.log('ehhh??');
      }  
    }

    if(loggedUser?.role === 'teacher' && isTeacherType(loggedUser)){
      console.log('TEACHEEER', loggedUser.isVerified);
      if(!loggedUser.isVerified){
        navigate("/teacher-pending");
      }
    }
  }, [isFetchingCurrentUser, isLoggedIn, loggedUser, navigate]);

  return (
    <div>
      <LogOut/>
      <p>{loggedUser?.name}</p>
    </div>
  )
}

export default Home