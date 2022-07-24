import React from 'react';
import { StudentType } from "../../types/user";
import styles from './Progress.module.css';
import { Link } from "react-router-dom";
import Arrow from '../UI/Arrow/Arrow';
import ProgressBar from '../ProgressBar/ProgressBar';

interface ProgressInterface {
  student: StudentType
}

const Progress: React.FC<ProgressInterface> = ({ student }) => {
  return (
    <Link to={`/student-topics-detail/${student.id}`} className={styles['progress-bar']}>
      <div className={styles['header']}>
        <h3>Progress</h3>
      </div>
      <ProgressBar student={student}/>
      <div className={styles['footer']}>
        <p>Detail</p>
        <Arrow right/>
      </div>
    </Link>
  )
}

export default Progress