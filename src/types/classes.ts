
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
  name: string;
  description: string;
  img: string;
  hasActivities: boolean;
}

export type TopicDataType = {
  name: string;
  activities: ActivityType[]
}

export type ActivityType = {
  profile: string;
  profileActivities: {
    rushMode: boolean;
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
}

export type SelectClassType = ClassType & {
  teacher: string
}

export type ProfileDataSelect = ProfileDataType & {
  isChecked: boolean;
}

export type TopicDataSelect = TopicDataType & {
  isChecked: boolean;
}