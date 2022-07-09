import React from 'react';
import styles from './MessageModal.module.css';
import {userMessage} from '../../types/user';
import star from '../../img/star.png';
import fireworks from '../../img/animations/fireworks.gif';
import ReactDOM from 'react-dom';

interface MessageModalInterface {
  message: userMessage
}

const MessageModal: React.FC<MessageModalInterface> = ({message}) => {
  const animationRoot = document.getElementById("animation-root") as HTMLElement;
  return (
    <>
      {ReactDOM.createPortal(
        <img className={styles['animation']} src={fireworks} alt="animation" />,
        animationRoot
      )}
      
      <div className={styles['message']}>
        <img className={styles['icon']} src={star} alt="star" />
        <h1>{message.code}</h1>
        <p>{message.content}</p>
      </div>
    </>
  )
}

export default MessageModal