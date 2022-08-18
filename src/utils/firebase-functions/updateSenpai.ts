import { Firestore, updateDoc, doc, getDoc } from "firebase/firestore";
import { getSenpaiStudents } from "./getSenpaiActionsStudents";

export const updateSenpai = async (db: Firestore, senpaiId: string) => {
  const docRef = doc(db, "users", senpaiId);
  const currentSenpai = await getDoc(docRef);
  const students = await getSenpaiStudents(db, senpaiId);
  const senpaiPoints = students.reduce((prev, cur) => {
    return prev + cur.classState.points
  }, 0)
  updateDoc(doc(db, `users/${senpaiId}`), {
    classState: {...currentSenpai.data()?.classState, points: senpaiPoints}
  })
}