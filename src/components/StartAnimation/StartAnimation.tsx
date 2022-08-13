import React from 'react';
import ani from '../../img/ani.gif';
import styles from './StartAnimation.module.css';

const StartAnimation = () => {
  return (
    <div className={styles.container}>
      <img src={ani} alt="animation" />
    </div>
  )
}

export default StartAnimation