import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { InitialStateType } from '../../store/class-slice';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { getStudentsFromClass } from '../../utils/firebase-functions/getStudentsFromClass';
import { UserType, isStudentType, StudentType } from "../../types/user";
import Back from '../../components/Back/Back';
import styles from './ClassDetail.module.css';
import UserThumbNail from '../../components/UserThumbNail/UserThumbNail';

const ClassDetail = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const currentClass = userClasses.find(c => c.classId === classId);
  const [classUsers, setClassUsers] = useState<StudentType[]>([]);

  useEffect(() => {
    if (!currentClass){
      navigate('/');
      return
    }
    getStudentsFromClass(db, currentClass.classId)
      .then(usersData => {
        const newArray = usersData.filter(u => {
          return u.profile === 'Killer'
        })
        console.log(newArray)
        setClassUsers(newArray);
      })
  }, [classId, currentClass, navigate ])

  return (
    <div className={styles['class-detail']}>
      <Back/>
      <div className={styles['class-detail__students']}>
        {classUsers.map((user, index) => (
          <UserThumbNail 
            key={user.id} 
            rank={index + 1} 
            name={user.name} 
            studentId={user.universityId} 
            points={0} 
            isTeacher 
            id={user.id}
          />
        ))}
      </div>
    </div>
  )
}

export default ClassDetail