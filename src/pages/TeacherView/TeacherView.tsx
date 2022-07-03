import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TeacherType } from "../../types/user";
import styles from './TeacherView.module.css';
import LogOut from '../../components/LogOut/LogOut';
import plusIcon from '../../img/svg/plus.svg';
import ClassThumbNail from '../../components/ClassThumbNail/ClassThumbNail';
import { InitialStateType } from '../../store/class-slice';

interface TeacherViewInterface {
  teacherUser: TeacherType
}

const TeacherView: React.FC<TeacherViewInterface> = ({teacherUser}) => {
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const navigate = useNavigate();
  const handleCreateNewClass = () => {
    navigate('/create-class');
  }

  return (
    <div className={styles['teacher-view']}>
      <LogOut/>
      <header className={styles['teacher-view__header']}>
        <h1>Hi <b>{teacherUser.name}</b></h1>
        <div className={styles['teacher-view__class-actions']}>
          <p>Classes: <b>{userClasses.length}</b></p>
          <button onClick={handleCreateNewClass}>
            <img src={plusIcon} alt="plus" />
          </button>
        </div>
      </header>
      <article className={styles['teacher-view__classes']}>
        {
          userClasses.length > 0 &&
          userClasses.map( currentClass => (
            <ClassThumbNail
              key={currentClass.classId}
              isActive={currentClass.isActive}
              term= {currentClass.term} 
              schedule= {currentClass.schedule} 
              studentsQuantity={currentClass.studentsId.length}
            />
          ))
        }
      </article>
    </div>
  )
}

export default TeacherView