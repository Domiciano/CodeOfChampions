import { Firestore, query, collection, where, getDocs, } from "firebase/firestore";
import { TeacherType } from '../../types/user';

export const fetchAllTeachers = async (db: Firestore) => {
  const teacherClasses = query(collection(db, "users"), where("role", "==", 'teacher'));
    const querySnapshot = await getDocs(teacherClasses);
    const users: TeacherType[] = []
    querySnapshot.forEach((doc) => {
      const { 
        name,
        id,
        email,
        role,
        classesId,
        isVerified,
        messages,
        universityId
      } = doc.data();
      const currentUser: TeacherType = { 
        name,
        id,
        email,
        role,
        classesId,
        isVerified,
        messages,
        universityId
      };
      users.push(currentUser);
    });
    return users
}