import React from 'react';
import styles from './ErrorMsg.module.css';
import warningIcon from '../../img/svg/warning.svg';

interface ErrorMsgInterface {
  message: string;
}

const ErrorMsg: React.FC<ErrorMsgInterface> = ({ message }) => {
  return (
    <div className={styles.error}>
      <img src={warningIcon} alt="warning" />
      <p>{message}</p>
    </div>
  )
}

export default ErrorMsg