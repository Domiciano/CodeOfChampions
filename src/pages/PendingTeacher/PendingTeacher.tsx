import React, { useEffect } from 'react';
import { auth } from '../../utils/firebase-functions/getFirebaseInit';
import styles from './PendingTeacher.module.css';
import clockIcon from '../../img/svg/clock.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser, userAuthInitStateType } from '../../store/userAuth-slice';
import { Link } from "react-router-dom";

const PendingTeacher = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  
  useEffect(() => {
    if (isLoggedIn){
      dispatch(logOutUser(auth, () => {}))
    }
  }, [dispatch, isLoggedIn])
  return (
    <div className={styles['pending']}>
      <div className={styles['pending__info']}>
        <img src={clockIcon} alt="clock" />
        <h3>Your account is being verified by us</h3>
        <p>Try <Link to="/login"><b>Login</b></Link> later on</p>
      </div>
    </div>
  )
}

export default PendingTeacher