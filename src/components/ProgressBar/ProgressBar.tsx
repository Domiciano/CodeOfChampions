import React from 'react';
import styles from './ProgressBar.module.css';
import { Link } from "react-router-dom";
import Arrow from '../UI/Arrow/Arrow';

const ProgressBar = () => {
  return (
    <Link to="/" className={styles['progress-bar']}>
      <div className={styles['header']}>
        <h3>Progress</h3>
        <p><b>6 </b>pt</p>
      </div>
      <div className={styles['bar-wrapper']}>
        <div className={styles['stage']}></div>
        <div className={styles['stage']}></div>
        <div className={styles['stage']}></div>
        <div className={styles['stage']}></div>
        <div className={styles['stage']}></div>
      </div>
        <div className={styles['footer']}>
          <p>Detail</p>
          <Arrow right/>
        </div>
    </Link>
  )
}

export default ProgressBar