import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import {setUsersSortByTopic, getUserTopicPoints} from '../../utils/handleSortByTopic';

const ClassDetail = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [currentTopicRanking, setCurrentTopicRanking] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const currentClass = userClasses.find(c => c.classId === classId);
  const [classUsers, setClassUsers] = useState<StudentType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<StudentType[]>([]);
  const [selectedProfileFilter, setSelectedProfileFilter] = useState('');
  const selectDropdownRef = useRef<any>();
  let position = 1

  const setRankingPosition = (classUsers: StudentType[], currentIndex: number, position: number) => {
    if(currentIndex === 0){
      return position
    } else if(getUserTopicPoints(classUsers[currentIndex-1], currentTopicRanking) === getUserTopicPoints(classUsers[currentIndex], currentTopicRanking)) {
      return position 
    }else {
      return position + 1
    }
  };
  console.log('XD')
  const handleFilterByProfile = (users: StudentType[], profile: string) => {
    return users.filter(u => {
      return u.profile.name.toLowerCase() === profile.toLowerCase()
    })
  }

  const filterStudentsByProfile = useCallback((profile: string) => {
    setFilteredUsers(handleFilterByProfile(classUsers, profile).sort((a,b) => b.classState.points - a.classState.points))
    handleSetTopicRanking(currentTopicRanking);
    setSelectedProfileFilter(profile);
  }, [classUsers, currentTopicRanking]);

  const handleSetTopicRanking = (topic: string) => {
    setCurrentTopicRanking(topic);
    setFilteredUsers(prev => setUsersSortByTopic(prev, topic));
    selectDropdownRef.current.close();
  }

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
      <h3 className={styles['class-detail__title']}>Class: {currentClass?.schedule}</h3>
      <SelectDropDown placeholder={currentTopicRanking} ref={selectDropdownRef}>
        <div className={styles['class-detail__ranking-select']}>
          { currentClass &&
            ['General', ...currentClass?.topics.map(t => t.name)].map(topic => (
              <p 
                key={topic}
                className={styles['profile']}
                onClick={handleSetTopicRanking.bind(null, topic)}
              >
                {topic}
              </p>
            ))
          }
        </div>
      </SelectDropDown>
      <article className={styles['class-detail__filter-actions']}>
        {currentClass?.profiles.map(profile => (
          <button
            className={selectedProfileFilter === profile.name ? styles['selected'] : ''}
            key={profile.name}
            onClick={filterStudentsByProfile.bind(null, profile.name)}
            style={{
              color: `var(--${profile.name.toLowerCase()}-color)`
            }}
          >
              {profile.name} ({handleFilterByProfile(classUsers, profile.name).length})
            </button>
        ))}
      </article>
      <div className={styles['class-detail__students']}>
        {filteredUsers.map((user, index) => {
          position = setRankingPosition(filteredUsers, index, position)
          return <UserThumbNail 
            key={user.id} 
            rank={position} 
            name={user.name} 
            studentId={user.universityId} 
            points={getUserTopicPoints(user, currentTopicRanking) || 0}
            isTeacher 
            id={user.id}
            user={user}
          />
        }
        )}
      </div>
    </div>
  )
}

export default ClassDetail