import React from 'react';
import styles from './ClassThumbNail.module.css';
import { Link } from "react-router-dom";
import usersIcon from '../../img/svg/users.svg';
import Arrow from '../UI/Arrow/Arrow';

interface ClassThumbNailInterface {
  term: string;
  schedule: string;
  studentsQuantity: number
  isActive: boolean;
}

const ClassThumbNail: React.FC<ClassThumbNailInterface> = ({ term, schedule, studentsQuantity, isActive }) => {
  return (
    <Link to="/" className={`${styles['class-thumbnail']} ${!isActive ? styles['class-thumbnail--inactive'] : ''}`}>
      <div className={styles['class-thumbnail__main-info']}>
        <h3>{term}</h3>
        <p>{schedule}</p>
      </div>
      <div className={styles['class-thumbnail__bottom-elem']}>
        <div className={styles['class-thumbnail__students']}>
          <img src={usersIcon} alt="users" />
          <p>Students: <b>{studentsQuantity}</b></p>
        </div>
        <Arrow right/>
      </div>
    </Link>
  )
}

export default ClassThumbNail