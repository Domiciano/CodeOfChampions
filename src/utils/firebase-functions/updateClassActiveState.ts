import { Firestore, updateDoc, doc } from "firebase/firestore";

export const updateClassActiveState = async (db: Firestore, classId: string, newState: boolean) => {
  updateDoc(doc(db, `classes/${classId}`), {
    isActive: newState
  })
}