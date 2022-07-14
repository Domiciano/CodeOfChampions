import React from 'react';
import { StudentType } from "../../types/user";
import styles from './ProgressBar.module.css';
import { Link } from "react-router-dom";
import Arrow from '../UI/Arrow/Arrow';

interface ProgressBarInterface {
  student: StudentType
}

const ProgressBar: React.FC<ProgressBarInterface> = ({ student }) => {
  return (
    <Link to="/" className={styles['progress-bar']}>
      <div className={styles['header']}>
        <h3>Progress</h3>
      </div>
      <div className={styles['bar-wrapper']}>
        {
          student.classState.topics.map(topic => (
            <div key={topic.name} className={styles['stage']}>
              {
                topic.topicActivities.map(ta => (
                  <div key={ta.id} className={styles['activity']}></div>
                ))
              }
            </div>
          ))
        }
      </div>
        <div className={styles['footer']}>
          <p>Detail</p>
          <Arrow right/>
        </div>
    </Link>
  )
}

export default ProgressBar