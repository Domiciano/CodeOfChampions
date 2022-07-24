import { Firestore, updateDoc, doc } from "firebase/firestore";
import { TeacherType } from '../../types/user';

export const setTeachersVerifiedState = async (db: Firestore, teachers: TeacherType[], callback: Function) => {
  teachers.forEach(teacher => {
    updateDoc(doc(db, `users/${teacher.id}`), {isVerified: teacher.isVerified})
    .then(() => {
      if(callback) callback();
    })
  })
}