import React from 'react';
import { ActivityState } from '../../types/classes';
import { StudentType } from '../../types/user';
import styles from './ProgressBar.module.css';

interface ProgressBarInterface {
  student: StudentType
}

const ProgressBar: React.FC<ProgressBarInterface> = ({student}) => {
  const setActivityColor = (activityState: ActivityState) => {
    let color = "";
    switch (activityState) {
      case 'almost': 
        color =  "yellow";
        break;
      case "complete":
        color =  "var(--app-color)";
        break;
      case "none": 
        color =  ""
        break;
      default:
        color =  ""
        break;
    }
    return color;
  }
  return (
    <div className={styles['bar-wrapper']}>
      {
        student.classState.topics.map(topic => (
          <div key={topic.name} className={styles['stage']}>
            {
              topic.topicActivities.map(ta => (
                <div 
                  key={ta.id} 
                  className={styles['activity']}
                  style={{
                    background: setActivityColor(ta.state)
                  }}
                ></div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default ProgressBar