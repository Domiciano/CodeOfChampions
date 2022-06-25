import React from 'react';
import styles from './ClassThumbNail.module.css';
import { Link } from "react-router-dom";
import usersIcon from '../../img/svg/users.svg';
import Arrow from '../UI/Arrow/Arrow';

interface ClassThumbNailInterface {

}

const ClassThumbNail: React.FC<ClassThumbNailInterface> = () => {
  return (
    <Link to="/" className={styles['class-thumbnail']}>
      <div className={styles['class-thumbnail__main-info']}>
        <h3>2022/2</h3>
        <p>Thursday, Wednesday, 7am-9am</p>
      </div>
      <div className={styles['class-thumbnail__bottom-elem']}>
        <div className={styles['class-thumbnail__students']}>
          <img src={usersIcon} alt="users" />
          <p>Students: <b>31</b></p>
        </div>
        <Arrow right/>
      </div>
    </Link>
  )
}

export default ClassThumbNail