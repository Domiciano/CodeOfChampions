export type UserType = {
  name: string, 
  id: string,
  email: string,
  role: 'teacher' | 'student',
  universityId: string,
  messages: userMessage[];
};

export type userMessage = {
  code: string,
  content: string,
  id: string,
};

export type TeacherType = UserType & {
  classesId: string[],
  isVerified: boolean
}

export type StudentType = UserType & {
  profile: {
    name: string,
  },
  points: number,
  belongedClassId: string,
}

export function isTeacherType(obj: any): obj is TeacherType {
  return obj.isVerified !== undefined && obj.classesId !== undefined 
}

export function isStudentType(obj: any): obj is StudentType {
  return obj.belongedClassId !== undefined && obj.profile !== undefined && obj.points !== undefined 
}
