import React from 'react';
import styles from './StudentInfo.module.css';

interface StudentInfoInterface {
  name: string,
  profile: string,
  studentId: string
}

const StudentInfo: React.FC<StudentInfoInterface> = ({name, profile, studentId}) => {
  return (
    <div className={styles['student-info']}>
      <aside
        style={{
          background: `var(--${profile.toLowerCase()})`
        }}
      ></aside>
      <div>
        <h1>{name}</h1>
        <p>{studentId}</p>
      </div>
    </div>
  )
}

export default StudentInfo