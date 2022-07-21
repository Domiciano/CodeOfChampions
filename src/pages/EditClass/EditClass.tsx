import React, { useEffect, useRef, useState } from 'react';
import styles from './EditClass.module.css';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { InitialStateType, updateClassTopics } from '../../store/class-slice';
import EditTopics from '../../components/EditTopics/EditTopics';
import { ActivityType, Difficulty, TopicDataType } from '../../types/classes';
import MainBtn from '../../components/MainBtn/MainBtn';
import Back from '../../components/Back/Back';
import { getClassByID } from '../../utils/firebase-functions/getClassByID';
// import { updateClassTopics } from '../../utils/firebase-functions/updateClassTopics';
import { updateClassActiveState } from '../../utils/firebase-functions/updateClassActiveState';
import CheckBox from '../../components/CheckBox/CheckBox';
import uniqid from 'uniqid';
import { logOutUser, userAuthInitStateType } from '../../store/userAuth-slice';
import { isTeacherType } from '../../types/user';

const EditClass = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const loggedUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const [topics, setTopics] = useState<TopicDataType[] | null>();
  const [classIsActive, setClassIsActive] = useState<boolean | null>(null);
  const levelDifficultySelectDropdownRef = useRef<any>();
  const dispatch = useDispatch();

  const addNewActivity = (currentTopic: TopicDataType, currentActivity: ActivityType) => {
    setTopics(prev => {
      if(prev){
        const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
        let prevCopy = [...prev];
        const activityIndex = prevCopy[topicIndex].activities.findIndex(p => p.profile === currentActivity.profile);
        const currentProfileActivity = prevCopy[topicIndex].activities[activityIndex];
        currentProfileActivity.profileActivities.push({
          difficulty: 'easy',
          podiumFirst: '',
          podiumSecond: '',
          podiumThird: '',
          activityId: uniqid(),
          name: "activity"
        })
        return prevCopy;
      }
    })
  }

  const handleDeleteActivity = (currentTopic: TopicDataType, activityIndex: number, profileActivityIndex: number) => {
    console.log(profileActivityIndex)
    setTopics(prev => {
      if(prev){
        const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
        let prevCopy = [...prev];
        console.log(prevCopy[topicIndex].activities[activityIndex].profileActivities)
        prevCopy[topicIndex].activities[activityIndex].profileActivities.splice(0, 1);
        return prevCopy;
      }
    })
  }

  const handleSetDifficulty = (currentTopic: TopicDataType, activityIndex: number, profileActivityIndex: number, difficulty: Difficulty) => {
    setTopics(prev => {
      if(prev){
        const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
        let prevCopy = [...prev];
        prevCopy[topicIndex].activities[activityIndex].profileActivities[profileActivityIndex].difficulty = difficulty;
        return prevCopy;
      }
    })
    levelDifficultySelectDropdownRef.current.close();
  }

  const handleChangeActivityName = (currentTopicIndex: number, activityIndex: number, profileActivityIndex: number, name: string) => {
    setTopics(prev => {
      if(prev){
        let prevCopy = [...prev];
        prevCopy[currentTopicIndex].activities[activityIndex].profileActivities[profileActivityIndex].name = name;
        return prevCopy;
      }
    })
  }

  const handleButtonClick = () => {
    if(!classId) return
    const currentClassReference = userClasses.find(c => c.classId === classId);
    if(!topics || !currentClassReference) return
    const currentClassProfilesWithActivities = currentClassReference.profiles.filter(p => p.hasActivities).map(p => p.name);
    dispatch(updateClassTopics(db, currentClassReference.teacherId, currentClassProfilesWithActivities, classId, topics, () => {
      if(classIsActive !== null){
        updateClassActiveState(db, classId, classIsActive)
      }
      navigate(`/class-detail/${currentClassReference.classId}`)
    }))
  }

  const handleClassActiveState = () => {
    setClassIsActive(prev => !prev);
  }
  
  useEffect(() => {
    if(!classId) return
    getClassByID(classId, db)
      .then((doc) => {
        const dataInfo = doc.data();
        if(dataInfo){
          setTopics(dataInfo.topics)
          setClassIsActive(dataInfo.isActive);
        }
      })
  }, [classId]);

  useEffect(() => {
    if(!isFetchingCurrentUser){
      console.log('AAA', isLoggedIn);
      // * At this moment, the fetch process is finished
      // TODO: Check if there is a user login
      if(!isLoggedIn){
        navigate("/login");
      }  
    }

    if(loggedUser?.role === 'teacher' && isTeacherType(loggedUser)){
      if(!loggedUser.isVerified){
        dispatch(logOutUser(auth, () => {
          navigate("/teacher-pending");
        }))
      }
    }else {
      navigate("/");
    }
  }, [dispatch, isFetchingCurrentUser, isLoggedIn, loggedUser, navigate]);
  return (
    <div className={styles['edit-class']}>
      <Back/>
      <div className={styles['set-active-state']}>
        <h4>Class Active State</h4>
        <button onClick={handleClassActiveState}>
          {classIsActive !== null && <CheckBox isActive={classIsActive}/>}
        </button>
      </div>
      {topics && 
        <EditTopics 
          topics={topics} 
          addNewActivity={addNewActivity} 
          handleChangeActivityName={handleChangeActivityName} 
          levelDifficultySelectDropdownRef={levelDifficultySelectDropdownRef} 
          handleSetDifficulty={handleSetDifficulty} 
          handleDeleteActivity={handleDeleteActivity} 
        />
      }
      <MainBtn text={'Update Class'} action={handleButtonClick}/>
    </div>
  )
}

export default EditClass