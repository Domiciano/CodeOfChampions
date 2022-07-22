import React, {useEffect, useRef, useState} from 'react';
import uniqid from 'uniqid';
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
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import { updateStudentClassState } from '../../utils/firebase-functions/updateStudentClassState';
import { sendMessage } from '../../utils/firebase-functions/sendMessage';
import { useSelector } from 'react-redux';
import data from '../../data/profiles.json';
import { InitialStateType } from '../../store/class-slice';

const activityStateOPtions: ActivityState[] = ["none", "complete", "almost"];

const EvaluateStudent = () => {
  const [currentUser, setCurrentUser] = useState<StudentType | null>();
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const { userId } = useParams();
  const navigate = useNavigate();
  const activityStateRef = useRef<any>();
  const currentUserClass = userClasses.find(uc => uc.classId === currentUser?.belongedClassId);
  const handleActivityState = (topicIndex: number, activityIndex: number, state: ActivityState) => {
    activityStateRef.current.close();
    // const currentClassData = userClasses.find(c => c.classId === currentUser?.belongedClassId);
    setCurrentUser(prev => {
      if(!prev) return;
      const copyPrev = {...prev};
      copyPrev.classState.topics[topicIndex].topicActivities[activityIndex].state = state;
      copyPrev.classState.topics.forEach(topic => {
        const newTopicPoints = topic.topicActivities.reduce((previousValueActivity, currentValueActivity) => {
          return previousValueActivity + (data.activityStateOPtions.find(d => d.name === currentValueActivity.state)?.value || 0)
        }, 0);
        topic.topicPoints = newTopicPoints;
      });
      const newUserPoints = copyPrev.classState.topics.reduce((previousTopicPoints, currentTopicPoints) => {
        return previousTopicPoints + currentTopicPoints.topicPoints
      },0)
      copyPrev.classState.points = newUserPoints;
      return copyPrev;
    })
  }
  
  const handleUpdateStudent: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // !BAD CODE
    if(!userId) return
    getCurrentUser(userId, db)
      .then(_currentUser => {
        const currentUserData = _currentUser.data();
        if(!currentUserData) return
        const studentData = setUserDataFromObj(currentUserData);
        if(!isStudentType(studentData)) return
        console.log(studentData.classState.points)
        studentData?.classState.topics.forEach((t, tIndex) => {
          if(t.topicActivities.every(ta => ta.state === "complete")){
            console.log('no mensaje para', t.name)
          }else if(currentUser?.classState.topics[tIndex].topicActivities.every(ta => ta.state === "complete")){
            console.log("Mensaje para", t.name)
            sendMessage(db, userId, {
              code: "Congratulations",
              content: `You did a great job completing the level ${t.name} successfully`,
              id: uniqid()
            })
          }
          if(currentUser){
            updateStudentClassState(db, currentUser?.id, currentUser.classState, () => {
              //TODO: update the redux object regarding this class
              navigate(`/class-detail/${currentUser?.belongedClassId}`)
            })
          }
        })
      })
  }

  useEffect(() => {
    if(!userId) return
    if(userClasses.length === 0){
      navigate('/');
    }
    getCurrentUser(userId, db)
      .then(_currentUser => {
        const currentUserData = _currentUser.data();
        if(!currentUserData) {
          navigate("/");
        }else{
          const studentData = setUserDataFromObj(currentUserData);
          if(isStudentType(studentData)){
            setCurrentUser(studentData);
          }
        }
      })
  }, [navigate, userClasses.length, userId]);
  
  return (
    <div className={styles['evaluate-student']}>
      <Back/>
      {
        currentUser && 
        <StudentInfo 
          name={currentUser?.name} 
          profile={currentUser?.profile.name} 
          studentId={currentUser?.universityId}
          image={currentUserClass?.profiles.find(p => p.name === currentUser.profile.name)?.img || ''}
        />
      }
      <form className={styles['form']} onSubmit={handleUpdateStudent}>
        <header className={styles['form__header']}>
          <h2>Topics</h2>
          <h3>Points: {currentUser?.classState.points}</h3>
        </header>
        <section className={styles['topics']}>
          {
            currentUser && currentUser.profile.name !== 'Sensei' && 
            currentUser.classState.topics.map((topic, topicIndex) => (
              <div key={topic.name} className={styles['topic']}>
                <h3>{topic.name}: {topic.topicPoints}</h3>
                {topic.topicActivities.map((ta, taIndex) => {
                  
                  const activityName = currentUserClass?.topics.find(t => t.name === topic.name)?.activities.find(a => a.profile === currentUser?.profile.name)?.profileActivities.find(pa => pa.activityId === ta.id)?.name;
                  
                  return (
                    <div key={ta.id} className={styles['activity']}>
                      <p className={styles['activity-tag']}>{taIndex+1} {activityName}</p>
                      <SelectDropDown placeholder={ta.state} ref={activityStateRef}>
                        {activityStateOPtions.map(activityState => (
                          <p className={styles['state-options']} onClick={handleActivityState.bind(null, topicIndex, taIndex, activityState)} key={activityState}>{activityState}</p>
                        ))}
                      </SelectDropDown>
                    </div>
                  )
                })}
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