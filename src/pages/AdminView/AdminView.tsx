import React, {useEffect, useState} from 'react'
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import LogOut from '../../components/LogOut/LogOut'
import { TeacherType } from '../../types/user'
import { fetchAllTeachers } from '../../utils/firebase-functions/fetchAllTeachers'
import styles from './AdminView.module.css';
import CheckBox from '../../components/CheckBox/CheckBox';
import MainBtn from '../../components/MainBtn/MainBtn';
import { setTeachersVerifiedState } from '../../utils/firebase-functions/setTeachersVerifiedState';
import Loader from '../../components/Loader/Loader';

const AdminView = () => {
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeachersState = () => {
    setIsLoading(true);
    fetchAllTeachers(db)
      .then(data => {
        setTeachers(data)
        setIsLoading(false);
      })
  }
  const handleUpdateTeachersState = () => {
    setIsLoading(true);
    setTeachersVerifiedState(db, teachers, fetchTeachersState)
  }

  const hanldeToggleTeacherState = (teacherIndex: number) => {
    setTeachers(prev => {
      const copy = [...prev];
      copy[teacherIndex].isVerified = !copy[teacherIndex].isVerified
      return copy
    })
  }

  useEffect(() => {
    fetchTeachersState();
  }, []);

  return (
    <div className={styles['admin-view']}>
      {isLoading && <Loader/>}
      <LogOut/>
      <div className={styles['teachers']}>
        {teachers.map((t, tIndex) => (
          <div 
            key={t.id}
            className={styles['teacher']}
          >
            <aside>
              <h3>{t.name}</h3>
              <p>{t.universityId}</p>
            </aside>
            <button 
              className={styles['check-btn']}
              onClick={hanldeToggleTeacherState.bind(null, tIndex)}
            >
              <p>Verify</p>
              <CheckBox isActive={t.isVerified}/>
            </button>
          </div>
        ))}
      </div>
      <MainBtn text={'Update Teachers State'} action={handleUpdateTeachersState}/>
    </div>
  )
}

export default AdminView