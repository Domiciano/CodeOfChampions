import React from 'react';
import styles from './TextInpunt.module.css';

interface TextInputInterface {
  icon?: JSX.Element;
  onChangeInputValue: Function;
  label: string;
  placeholder: string;
}


const TextInput: React.FC<TextInputInterface> = ({ icon, onChangeInputValue, placeholder, label }) => {

  const handleOnchangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChangeInputValue(e.target.value);
  }

  return (
    <div className={styles['text-input']}>
      {icon&& icon}
      <label>
        <p>{label}</p>
        <input 
          onChange={handleOnchangeInput} 
          type="text" 
          placeholder={placeholder}
        ></input>
      </label>
    </div>
  )
}

export default TextInput