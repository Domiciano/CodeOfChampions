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
import LoaderLine from '../../components/LoaderLine/LoaderLine';
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
  const [isLoading, setIsLoading] = useState(false);
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
    setTopics(prev => {
      if(prev){
        const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
        let prevCopy = [...prev];
        prevCopy[topicIndex].activities[activityIndex].profileActivities.splice(profileActivityIndex, 1);
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
    setIsLoading(true);
    if(!classId) return
    getClassByID(classId, db)
      .then((doc) => {
        const dataInfo = doc.data();
        if(dataInfo){
          setTopics(dataInfo.topics);
          setClassIsActive(dataInfo.isActive);
          setIsLoading(false);
        }
      })
  }, [classId]);

  useEffect(() => {
    if(!isFetchingCurrentUser){
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
    <>
      <header className={styles['edit-class__header']}>
        <Back/>
        <MainBtn text={'Update Class'} action={handleButtonClick}/>
      </header>
      <div className={styles['edit-class']}>
        <h1>Settings</h1>
        <section className={styles['edit-class__section']}>
          <h2>Class State</h2>
          <p>Edit the current status of the class wether the semester already has finished.</p>
          <div className={styles['set-active-state']}>
            <h4>Class Active State</h4>
            <button onClick={handleClassActiveState}>
              {classIsActive !== null && <CheckBox isActive={classIsActive}/>}
            </button>
          </div>
        </section>
        {isLoading && <LoaderLine/>}
        {topics && 
          <section className={styles['edit-class__section']}>
            <h2>Edit Class Topics Activities</h2>
            <p>Add, delete or modify the topics activities</p>
            <EditTopics 
              topics={topics} 
              addNewActivity={addNewActivity} 
              handleChangeActivityName={handleChangeActivityName} 
              levelDifficultySelectDropdownRef={levelDifficultySelectDropdownRef} 
              handleSetDifficulty={handleSetDifficulty} 
              handleDeleteActivity={handleDeleteActivity} 
            />
          </section>
        }
      </div>
    </>
  )
}

export default EditClass