
export type ClassType = {
  term: string,
  schedule: string,
  profiles: ProfileDataType[],
  topics: TopicDataType[],
  teacherId: string,
  classId: string,
  isActive: boolean,
  studentsId: string[],
}

export type ProfileDataType = {
  isChecked: boolean;
  name: string;
  description: string;
  img: string;
}

export type TopicDataType = {
  isChecked: boolean;
  name: string;
  activities: ActivityType[]
}

export type ActivityType = {
  rushMode: boolean;
}

export type SelectClassType = ClassType & {
  teacher: string
}