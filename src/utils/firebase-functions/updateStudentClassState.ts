
import { updateDoc, doc, Firestore } from "firebase/firestore";
import { ActivityPodium, ActivityState } from '../../types/classes';

export const updateStudentClassState = (db: Firestore, userId: string, classState: {
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
}, callback?: Function) => {
  updateDoc(doc(db, `users/${userId}`), {classState: classState})
    .then(() => {
      if(callback) callback();
    })
};