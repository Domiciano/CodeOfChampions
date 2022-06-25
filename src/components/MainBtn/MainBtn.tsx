import React from 'react';
import styles from './MainBtn.module.css';

interface MainBtnInterface{
  text: string;
  action: React.MouseEventHandler<HTMLButtonElement>
}

const MainBtn: React.FC<MainBtnInterface> = ({ text, action }) => {
  return (
    <button className={styles['main-btn']} onClick={action}>{text}</button>
  )
}

export default MainBtn