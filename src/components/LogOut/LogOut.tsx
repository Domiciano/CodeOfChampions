import React from 'react';
import styles from './LogOut.module.css';
import logoutIcon from '../../img/svg/logout.svg';
import { auth } from '../../utils/firebase-functions/getFirebaseInit';
import { useDispatch } from 'react-redux';
import { logOutUser } from '../../store/userAuth-slice';
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSIgnOut = () => {
    dispatch(logOutUser(auth))
    .then(() => {
      navigate('/');
    })
  }

  return (
    <button className={styles['log-out']} onClick={handleSIgnOut}>
      <img src={logoutIcon} alt="logout" />
      <p>Log out</p>
    </button>
  )
}

export default LogOut