import React from 'react';
import { useNavigate } from "react-router-dom";
import { TeacherType } from "../../types/user";
import styles from './TeacherView.module.css';
import LogOut from '../../components/LogOut/LogOut';
import plusIcon from '../../img/svg/plus.svg';
import ClassThumbNail from '../../components/ClassThumbNail/ClassThumbNail';


interface TeacherViewInterface {
  teacherUser: TeacherType
}

const TeacherView: React.FC<TeacherViewInterface> = ({teacherUser}) => {
  const navigate = useNavigate();
  const handleCreateNewClass = () => {
    navigate('/create-class')
  }

  return (
    <div className={styles['teacher-view']}>
      <LogOut/>
      <header className={styles['teacher-view__header']}>
        <h1>Hi <b>{teacherUser.name}</b></h1>
        <div className={styles['teacher-view__class-actions']}>
          <p>Classes: <b>2</b></p>
          <button onClick={handleCreateNewClass}>
            <img src={plusIcon} alt="plus" />
          </button>
        </div>
      </header>
      <article className={styles['teacher-view__classes']}>
        <ClassThumbNail 
          isActive={true}
          term='2022/2' 
          schedule='Thursday, Wednesday, 7am-9am' 
          studentsQuantity={31}
        />
        <ClassThumbNail 
          isActive={true}
          term='2022/2' 
          schedule='Thursday, Wednesday, 7am-9am' 
          studentsQuantity={31}
        />
        <ClassThumbNail 
          isActive={true}
          term='2022/2' 
          schedule='Thursday, Wednesday, 7am-9am' 
          studentsQuantity={31}
        />
      </article>
    </div>
  )
}

export default TeacherView