import { Firestore, query, collection, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { TopicDataType, ActivityState, ActivityPodium } from "../../types/classes";
import { isStudentType } from "../../types/user";
import { setUserDataFromObj } from "./setUserDataFromObj";
import data from '../../data/profiles.json';

export const updateClassTopics = async (db: Firestore, classProfiles: string[], classId: string, updatedTopics: TopicDataType[], callback: Function) => { 
  const topicsFromProfiles = classProfiles.map(cp => ({
    name: cp,
    topics: updatedTopics.map(ut => ({
      topicName: ut.name,
        activities: ut.activities.find(uta => uta.profile === cp)?.profileActivities
    }))
  }))

  updateDoc(doc(db, `classes/${classId}`), {
    topics: updatedTopics
  })

  classProfiles.forEach(profile => {
    const activeClasses = query(collection(db, "users"), where("belongedClassId", "==", classId), where("profile", "==", {name: profile}));
    getDocs(activeClasses)
      .then(querySnapshot => {
        querySnapshot.forEach((document) => {
          const currentUserData = document.data();
          const currentUser = setUserDataFromObj(currentUserData);
          if(isStudentType(currentUser)){
            let newClassState: {
              points: number,
              topics: {
                name: string,
                topicPoints: number,
                topicActivities: {
                  id: string,
                  state: ActivityState,
                  activityPodium?: ActivityPodium
                }[]
              }[]
            } = {
              points: 0,
              topics: []
            }
            currentUser.classState.topics.forEach((userTopics, topicsIndex) => {
              const currentTopicFromProfile = topicsFromProfiles.find(cp => cp.name ===profile)?.topics.find(t => t.topicName === userTopics.name)?.activities;
              if (!currentTopicFromProfile) return
              let activitiesCopy = [...userTopics.topicActivities];
              activitiesCopy = activitiesCopy.filter(ac => currentTopicFromProfile.some(ct => ac.id === ct.activityId))
              const newActivities: {id: string, state: ActivityState}[] = currentTopicFromProfile.filter(ac => activitiesCopy.every(ct => ac.activityId !== ct.id)).map(ct => ({
                id: ct.activityId,
                state: 'none'
              }))
              activitiesCopy = [...activitiesCopy, ...newActivities];
              const newTopicPoints = activitiesCopy.reduce((previousValueActivity, currentValueActivity) => {
                return previousValueActivity + (data.activityStateOPtions.find(d => d.name === currentValueActivity.state)?.value || 0)
              }, 0);
              newClassState.topics.push({
                name: userTopics.name,
                topicPoints: newTopicPoints,
                topicActivities: activitiesCopy
              })
            })
            const newUserPoints = newClassState.topics.reduce((previousTopicPoints, currentTopicPoints) => {
              return previousTopicPoints + currentTopicPoints.topicPoints
            },0)
            newClassState.points = newUserPoints;
            //* UPDATING ALL THE USERS
            updateDoc(doc(db, `users/${document.data().id}`), {classState: newClassState})
          }
        })
        callback();
      })
  })
}
