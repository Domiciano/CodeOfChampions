import React from 'react';
import styles from './Lock.module.css';

interface LockInterface {
  style?: string
}

const Lock: React.FC<LockInterface> = ({ style }) => {
  return (
    <svg className={`${style} ${styles['lock']}`} width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2.25C7.61884 2.25 8.21233 2.48705 8.64992 2.90901C9.0875 3.33097 9.33333 3.90326 9.33333 4.5V6.75H4.66667V4.5C4.66667 3.90326 4.9125 3.33097 5.35008 2.90901C5.78767 2.48705 6.38116 2.25 7 2.25V2.25ZM11.6667 6.921V4.5C11.6667 3.30653 11.175 2.16193 10.2998 1.31802C9.42466 0.474106 8.23768 0 7 0C5.76232 0 4.57534 0.474106 3.70017 1.31802C2.825 2.16193 2.33333 3.30653 2.33333 4.5V6.921C1.07333 7.2945 0 8.26425 0 9.675V15.075C0 16.911 1.82233 18 3.5 18H10.5C12.1777 18 14 16.911 14 15.075V9.675C14 8.26425 12.9267 7.2945 11.6667 6.921Z" fill="none"/>
    </svg>

  )
}

export default Lock