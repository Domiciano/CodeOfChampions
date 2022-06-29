export type UserType = {
  name: string, 
  id: string,
  email: string,
  role: 'teacher' | 'student',
};

export type TeacherType = UserType & {
  classesId: string[],
  isVerified: boolean
}

export type StudentType = UserType & {
  profile: 'apprentice' | 'killer' | 'learning',
  points: number,
  belongedClassId: string,
}

export function isTeacherType(obj: any): obj is TeacherType {
  return obj.isVerified !== undefined 
}