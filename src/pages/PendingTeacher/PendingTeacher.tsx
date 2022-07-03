import React from 'react';
import styles from './PendingTeacher.module.css';
import clockIcon from '../../img/svg/clock.svg';
import { Link } from "react-router-dom";

const PendingTeacher = () => {
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