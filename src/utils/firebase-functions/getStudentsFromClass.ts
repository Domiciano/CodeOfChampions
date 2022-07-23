import { Firestore, query, collection, where, getDocs, } from "firebase/firestore";
import { StudentType } from '../../types/user';

export const getStudentsFromClass = async (db: Firestore, classId: string) => {
  const teacherClasses = query(collection(db, "users"), where("belongedClassId", "==", classId));
    const querySnapshot = await getDocs(teacherClasses);
    const users: StudentType[] = []
    querySnapshot.forEach((doc) => {
      const { 
        name,
        id,
        email,
        role,
        universityId,
        profile,
        belongedClassId,
        messages,
        classState 
      } = doc.data();
      const currentUser: StudentType = { 
        name,
        id,
        email,
        role,
        universityId,
        profile,
        belongedClassId,
        messages,
        classState,
        senpaiId: profile.name === 'Apprentice' ? doc.data().senpaiId ? doc.data().senpaiId : '' : '',
        studentsId: profile.name === 'senpai' ? doc.data().studentsId : [],
      };
      users.push(currentUser);
    });
    return users
}