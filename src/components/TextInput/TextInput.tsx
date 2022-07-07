import React, { useState } from 'react';
import styles from './TextInpunt.module.css';

interface TextInputInterface {
  icon?: JSX.Element;
  onChangeInputValue: (value: string, event?:  React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  value: string;
  isPassword?: boolean;
  isError?: boolean;
}


const TextInput: React.FC<TextInputInterface> = ({ icon, onChangeInputValue, placeholder, label, value, isPassword, isError }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleOnchangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChangeInputValue(e.target.value, e);
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className={`${styles['text-input']} ${isError? styles['error'] : ''} ${isFocused? styles['focus'] : ''}`}>
      {icon&& icon}
      <label>
        <p>{label}</p>
        <input 
          onChange={handleOnchangeInput} 
          type={isPassword ? 'password' : 'text'}
          placeholder={placeholder}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></input>
      </label>
    </div>
  )
}

export default TextInput