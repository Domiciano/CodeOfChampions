import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { InitialStateType } from '../../store/class-slice';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { getStudentsFromClass } from '../../utils/firebase-functions/getStudentsFromClass';
import { StudentType } from "../../types/user";
import Back from '../../components/Back/Back';
import styles from './ClassDetail.module.css';
import UserThumbNail from '../../components/UserThumbNail/UserThumbNail';
import settingsIcon from '../../img/svg/settings.svg';
import Loader from '../../components/Loader/Loader';

const ClassDetail = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const currentClass = userClasses.find(c => c.classId === classId);
  const [classUsers, setClassUsers] = useState<StudentType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<StudentType[]>([]);
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('');

  const filterStudentsByProfile = useCallback((profile: string) => {
    setFilteredUsers(classUsers.filter(u => {
      return u.profile.name.toLowerCase() === profile.toLowerCase()
    }).sort((a,b) => b.classState.points - a.classState.points))
    setSelectedProfileFilter(profile);
  }, [classUsers])

  useEffect(() => {
    setIsLoading(true);
    if (!currentClass){
      navigate('/');
      return
    }
    getStudentsFromClass(db, currentClass.classId)
    .then(usersData => {
      setIsLoading(false);
      setClassUsers(usersData);
    })
    setSelectedProfileFilter(currentClass.profiles[0].name);
  }, [currentClass, navigate]);

  useEffect(() => {
    if(!currentClass) return;
    filterStudentsByProfile(currentClass.profiles[0].name);
  }, [currentClass, filterStudentsByProfile]);

  return (
    <div className={styles['class-detail']}>
      {isLoading && <Loader/>}
      <header className={styles['class-detail__header']}>
        <Back route="/" />
        <button onClick={() => {
          navigate(`/edit-class/${currentClass?.classId}`);
        }}>
          <img src={settingsIcon} alt="settings" />
        </button>
      </header>
      <article className={styles['class-detail__filter-actions']}>
        {currentClass?.profiles.map(profile => (
          <button
            className={selectedProfileFilter === profile.name ? styles['selected'] : ''}
            key={profile.name}
            onClick={filterStudentsByProfile.bind(null, profile.name)}
          >
              {profile.name}
            </button>
        ))}
      </article>
      <div className={styles['class-detail__students']}>
        {filteredUsers.map((user, index) => (
          <UserThumbNail 
            key={user.id} 
            rank={index + 1} 
            name={user.name} 
            studentId={user.universityId} 
            points={user.classState.points} 
            isTeacher 
            id={user.id}
          />
        ))}
      </div>
    </div>
  )
}

export default ClassDetail