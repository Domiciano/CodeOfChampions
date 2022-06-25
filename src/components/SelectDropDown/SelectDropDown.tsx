import React, { useState } from 'react';
import styles from './SelectDropDown.module.css';
import pointerIcon from '../../img/svg/pointer.svg';

interface SelectDropDownInterface {
  children: React.ReactNode;
  placeholder: string;
}

const SelectDropDown: React.FC<SelectDropDownInterface> = ({ children, placeholder }) => {
  const [isActive, setIsActive] = useState(false);
  const handleToggleOptions = () => {
    setIsActive(prev => !prev);
  }
  return (
    <div className={styles['select-dropdown']}>
      <div 
        className={`${styles['select-dropdown__input']} ${isActive ? styles['select-dropdown__input--active'] : ''}`}
        onClick={handleToggleOptions}
      >
        <p>{placeholder}</p>
        <img src={pointerIcon} alt="pointer"/>
      </div>
      {isActive && <div className={styles['select-dropdown__options']}>{children}</div>}
    </div>
  )
}

export default SelectDropDown