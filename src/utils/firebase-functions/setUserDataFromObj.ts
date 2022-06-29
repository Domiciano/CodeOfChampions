import { DocumentData } from "firebase/firestore";
import { UserType, StudentType, TeacherType } from "../../types/user";

export const setUserDataFromObj = (docData: DocumentData) => {
  const {name, id, email, role} = docData; 
  if(docData.role === 'student'){
    const studentData: StudentType = {
      name, 
      email,
      id, 
      role, 
      profile: docData.profile,
      points: docData.points,
      belongedClassId: docData.belongedClassId
    }
    return studentData
  }else{
    const teacherData: TeacherType = {
      name, 
      email, 
      id, 
      role, 
      classesId: docData.classId || [] ,
      isVerified: docData.isVerified
    }
    return teacherData
  }
}