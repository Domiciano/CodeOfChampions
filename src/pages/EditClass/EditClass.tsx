import React, { useEffect, useRef, useState } from 'react';
import styles from './EditClass.module.css';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { InitialStateType } from '../../store/class-slice';
import EditTopics from '../../components/EditTopics/EditTopics';
import { ActivityType, Difficulty, TopicDataType } from '../../types/classes';
import MainBtn from '../../components/MainBtn/MainBtn';
import Back from '../../components/Back/Back';
import { getClassByID } from '../../utils/firebase-functions/getClassByID';
import { updateClassTopics } from '../../utils/firebase-functions/updateClassTopics';

import uniqid from 'uniqid';

const EditClass = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const [topics, setTopics] = useState<TopicDataType[] | null>();
  const levelDifficultySelectDropdownRef = useRef<any>();

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
    updateClassTopics(db, currentClassProfilesWithActivities, classId, topics, () => {
      navigate(`/class-detail/${currentClassReference.classId}`)
    })
  }
  
  useEffect(() => {
    if(!classId) return
    getClassByID(classId, db)
      .then((doc) => {
        const dataInfo = doc.data();
        if(dataInfo){
          setTopics(dataInfo.topics)
        }
      })

  }, [classId]);
  return (
    <div className={styles['edit-class']}>
      <Back/>
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