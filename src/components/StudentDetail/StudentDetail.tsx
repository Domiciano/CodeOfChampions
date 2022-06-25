import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from "react-router-dom";
import { userAuthInitStateType } from '../../store/userAuth-slice';
import { UserType } from '../../types/user';
import { getCurrentUser } from '../../utils/firebase-functions/getCurrentUser';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { setUserDataFromObj } from '../../utils/firebase-functions/setUserDataFromObj';
import styles from './StudentDetail.module.css';

const StudentDetail = () => {
  const navigate = useNavigate();
  // * Redux context state variables
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const { userId } = useParams();
  // * The requested user
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // TODO: Check if the fetching is ongoing
    if(!isFetchingCurrentUser){
      // * At this moment, the fetch process is finished
      // TODO: Check if there is a user login
      if(!isLoggedIn){
        navigate("/");
      }
    }
    getCurrentUser(userId || '', db)
      .then( _currentUser => {
        const currentUserData = _currentUser.data();
        if( currentUserData === undefined) {
          // TODO: If there is no user from the given ID, then navigate to home
          navigate("/");
        }else{
          setUser(setUserDataFromObj(currentUserData));
        }
      })
      .catch(error => {
        console.log(error, error.code, error.message);
      })
  }, [isLoggedIn, isFetchingCurrentUser, navigate, userId]);
  return (
    <>
      {user && (
        <div className={styles['student-detail']}>
          <h1>{user?.first}</h1>
          <p><b>Last:</b> {user?.last}</p>
          <p><b>Born:</b> {user?.born}</p>
          <p><b>ID:</b> {user?.id}</p>
        </div>
      )}
      <Link to="/">Home</Link>
    </>
  )
}

export default StudentDetail