import { DocumentData } from "firebase/firestore";
import { StudentType, TeacherType } from "../../types/user";

export const setUserDataFromObj = (docData: DocumentData) => {
  const {name, id, email, role, universityId, messages} = docData; 
  if(docData.role === 'student'){
    const studentData: StudentType = {
      name, 
      email,
      id, 
      role, 
      profile: docData.profile,
      belongedClassId: docData.belongedClassId,
      universityId,
      messages,
      classState: docData.classState,
      studentsId: docData.studentsId || [],
      senpaiId: docData.senpaiId || '',
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
      universityId,
      messages
    }
    return teacherData
  }
}