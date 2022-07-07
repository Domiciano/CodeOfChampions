import React from 'react';
import LogOut from '../../components/LogOut/LogOut';
import { StudentType } from "../../types/user";
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import { useSelector } from "react-redux";
import { InitialStateType } from '../../store/class-slice';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import styles from './StudentView.module.css';

interface StudentViewInterface {
  studentUser: StudentType
}

const StudentView: React.FC<StudentViewInterface> = ({studentUser}) => {
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses)[0];
  console.log(userClasses);
  
  return (
    <div className={styles['student-view']}>
      <LogOut/>
      <StudentInfo 
        name={studentUser.name} 
        profile={studentUser.profile}
        studentId={studentUser.universityId}
      />
      <ProgressBar/>
    </div>
  )
}

export default StudentView