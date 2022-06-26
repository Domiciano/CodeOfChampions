import React from 'react';
import styles from './TextInpunt.module.css';

interface TextInputInterface {
  icon?: JSX.Element;
  onChangeInputValue: Function;
  label: string;
  placeholder: string;
  value: string;
  isPassword?: boolean;
  isError?: boolean;
}


const TextInput: React.FC<TextInputInterface> = ({ icon, onChangeInputValue, placeholder, label, value, isPassword, isError }) => {

  const handleOnchangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChangeInputValue(e.target.value);
  }

  return (
    <div className={`${styles['text-input']} ${isError? styles['error'] : ''}`}>
      {icon&& icon}
      <label>
        <p>{label}</p>
        <input 
          onChange={handleOnchangeInput} 
          type={isPassword ? 'password' : 'text'}
          placeholder={placeholder}
          value={value}
        ></input>
      </label>
    </div>
  )
}

export default TextInput