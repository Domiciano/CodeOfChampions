import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';
import cancelIcon from '../../img/svg/cancel.svg';

interface ModalInterface {
  children: React.ReactNode;
  onCancelBtnAction: React.MouseEventHandler<HTMLButtonElement>;
}

const Modal: React.FC<ModalInterface> = ({ children, onCancelBtnAction }) => {
  const modalRoot = document.getElementById("modal-root") as HTMLElement;
  const backdrop = document.getElementById("backdrop-root") as HTMLElement;
  return (
    <>
      {ReactDOM.createPortal(
        <div 
          className={styles['modal-wrapper']}
        ></div>,
        backdrop
      )}
      {ReactDOM.createPortal(
        <div 
          className={styles['container']}
        >
          <button onClick={onCancelBtnAction} className={styles['cancel-btn']}>
            <img src={cancelIcon} alt="cancel button"/>
          </button>
          {children}
        </div>,
        modalRoot
      )}
    </>
  )
}

export default Modal