import React from 'react';
import styles from './Back.module.css';
import Arrow from '../UI/Arrow/Arrow';
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <button className={styles['back']} onClick={() => {navigate(-1)}}>
      <Arrow/>
      <p>Back</p>
    </button>
  )
}

export default Back