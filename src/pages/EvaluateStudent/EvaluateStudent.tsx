import React, {useEffect, useRef, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentType, isStudentType } from '../../types/user';
import { ActivityState } from '../../types/classes';
import { getCurrentUser } from '../../utils/firebase-functions/getCurrentUser';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { setUserDataFromObj } from '../../utils/firebase-functions/setUserDataFromObj';
import MainBtn from '../../components/MainBtn/MainBtn';
import Back from '../../components/Back/Back';
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import styles from './EvaluateStudent.module.css';
// import { useSelector } from 'react-redux';
import data from '../../data/profiles.json';
// import { InitialStateType } from '../../store/class-slice';

const activityStateOPtions: ActivityState[] = ["none", "complete", "almost"];

const EvaluateStudent = () => {
  const [currentUser, setCurrentUser] = useState<StudentType | null>();
  // const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const { userId } = useParams();
  const navigate = useNavigate();
  const activityStateRef = useRef<any>();
  
  const handleActivityState = (topicIndex: number, activityIndex: number, state: ActivityState) => {
    console.log(topicIndex, activityIndex, state);
    activityStateRef.current.close();
    // const currentClassData = userClasses.find(c => c.classId === currentUser?.belongedClassId);
    setCurrentUser(prev => {
      if(!prev) return;
      const copyPrev = {...prev};
      copyPrev.classState.topics[topicIndex].topicActivities[activityIndex].state = state;
      const newPoints = copyPrev.classState.topics.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.topicActivities.reduce((previousValueActivity, currentValueActivity) => {
          return previousValueActivity + (data.activityStateOPtions.find(d => d.name === currentValueActivity.state)?.value || 0)
        }, 0)
      }, 0)
      // console.log(newPoints)
      copyPrev.points = newPoints;
      return copyPrev;
    })
  }
  console.log('xd')
  useEffect(() => {
    getCurrentUser(userId || '', db)
      .then(_currentUser => {
        const currentUserData = _currentUser.data();
        if(!currentUserData) {
          navigate("/");
        }else{
          const studentData = setUserDataFromObj(currentUserData);
          if(isStudentType(studentData)){
            setCurrentUser(studentData);
            console.log('ZZ')
          }
        }
      })
  }, [navigate, userId]);
  console.log(userId)
  return (
    <div className={styles['evaluate-student']}>
      <Back/>
      <header>
        <h1>{currentUser?.name}</h1>
      </header>
      <form className={styles['form']}>
        <header className={styles['form__header']}>
          <h2>Topics</h2>
          <h3>Points: {currentUser?.points}</h3>
        </header>
        <section className={styles['topics']}>
          {
            currentUser && 
            currentUser.classState.topics.map((topic, topicIndex) => (
              <div key={topic.name} className={styles['topic']}>
                <h3>{topic.name}</h3>
                {topic.topicActivities.map((ta, taIndex) => (
                  <div key={ta.id} className={styles['activity']}>
                    <p className={styles['activity-tag']}>{taIndex+1} Activity </p>
                    <SelectDropDown placeholder={ta.state} ref={activityStateRef}>
                      {activityStateOPtions.map(activityState => (
                        <p className={styles['state-options']} onClick={handleActivityState.bind(null, topicIndex, taIndex, activityState)} key={activityState}>{activityState}</p>
                      ))}
                    </SelectDropDown>
                  </div>
                ))}
              </div>
            ))
          }
        </section>
        <MainBtn text={'Update'} action={() => {}}/>
      </form>
    </div>
  )
}

export default EvaluateStudent