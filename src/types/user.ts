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