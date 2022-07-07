import { DocumentData } from "firebase/firestore";
import { UserType, StudentType, TeacherType } from "../../types/user";

export const setUserDataFromObj = (docData: DocumentData) => {
  const {name, id, email, role, universityId} = docData; 
  if(docData.role === 'student'){
    const studentData: StudentType = {
      name, 
      email,
      id, 
      role, 
      profile: docData.profile,
      points: docData.points,
      belongedClassId: docData.belongedClassId,
      universityId
    }
    return studentData
  }else{
    const teacherData: TeacherType = {
      name, 
      email, 
      id, 
      role, 
      classesId: docData.classId || [] ,
      isVerified: docData.isVerified,
      universityId
    }
    return teacherData
  }
}