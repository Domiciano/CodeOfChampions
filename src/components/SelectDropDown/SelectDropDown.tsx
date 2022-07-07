import React, { useState, useImperativeHandle } from 'react';
import styles from './SelectDropDown.module.css';
import pointerIcon from '../../img/svg/pointer.svg';

interface SelectDropDownInterface {
  children: React.ReactNode;
  placeholder: string;
  ref: React.Ref<unknown> | null;
  error?: boolean
}

const SelectDropDown: React.FC<SelectDropDownInterface> = React.forwardRef(({ children, placeholder, error}, ref) => {
  const [isActive, setIsActive] = useState(false);
  const handleToggleOptions = () => {
    setIsActive(prev => !prev);
  }
  const onCloseOptions = () => {
    setIsActive(false);
  }
  useImperativeHandle(ref, () => {
    return {
      close: onCloseOptions
    }
  })
  return (
    <div className={styles['select-dropdown']}>
      <div 
        className={`${styles['select-dropdown__input']} ${isActive ? styles['select-dropdown__input--active'] : ''} ${error ? styles['error'] : ''}`}
        onClick={handleToggleOptions}
      >
        <p>{placeholder}</p>
        <img src={pointerIcon} alt="pointer"/>
      </div>
      {isActive && <div className={styles['select-dropdown__options']}>{children}</div>}
    </div>
  )
})

export default SelectDropDown