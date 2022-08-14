import React, { useState, useImperativeHandle } from 'react';
import styles from './SelectDropDown.module.css';
import pointerIcon from '../../img/svg/pointer.svg';

interface SelectDropDownInterface {
  children: React.ReactNode;
  placeholder: string;
  ref: React.Ref<unknown> | null;
  error?: boolean;
  allowActive?: boolean;
  style?: React.CSSProperties;
}

const SelectDropDown: React.FC<SelectDropDownInterface> = React.forwardRef(({ children, placeholder, error, allowActive, style}, ref) => {
  const [isActive, setIsActive] = useState(false);
  const handleToggleOptions = () => {
    if(allowActive !== false){
      setIsActive(prev => !prev);
    }
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
    <div 
      className={styles['select-dropdown']}
      style={{
        opacity: allowActive !== false ? 1 : 0.3,
      }}
    >
      <div 
        className={`${styles['select-dropdown__input']} ${isActive ? styles['select-dropdown__input--active'] : ''} ${error ? styles['error'] : ''}`}
        onClick={handleToggleOptions}
        style={style}
      >
        <p>{placeholder}</p>
        <img src={pointerIcon} alt="pointer"/>
      </div>
      {isActive && <div className={styles['select-dropdown__options']}>{children}</div>}
    </div>
  )
})

export default SelectDropDown