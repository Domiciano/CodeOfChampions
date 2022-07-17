import React from 'react';
import styles from './Back.module.css';
import Arrow from '../UI/Arrow/Arrow';
import { useNavigate } from "react-router-dom";

interface BacKInterface {
  route?: string;
}

const Back: React.FC<BacKInterface> = ({route}) => {
  const navigate = useNavigate();
  return (
    <button className={styles['back']} onClick={() => {
      if(route){
        navigate(route)
      }else{
        navigate(-1)
      }
    }}>
      <Arrow/>
      <p>Back</p>
    </button>
  )
}

export default Back