import React from 'react';
import styles from './LoaderLine.module.css';

const LoaderLine = () => {
  return (
    <div className={styles['loader']}>
      <div className={styles['loader__element']}></div>
    </div>
  )
}

export default LoaderLine