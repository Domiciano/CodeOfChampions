import { StudentType } from "../types/user";

export const getUserTopicPoints = (user: StudentType, topic: string) =>{
  if(topic === 'General') {
    return  user?.classState?.points
  }else {
    return  user?.classState?.topics.find(t => t.name === topic)?.topicPoints;
  }
}

export const setUsersSortByTopic = (users: StudentType[], topic: string) => {
  if(topic === 'General') {
    return users.sort((a, b) => b.classState.points - a.classState.points)
  }else{
    return users.sort((a, b) => {
      const aPoints = getUserTopicPoints(a, topic);
      const bPoints = getUserTopicPoints(b, topic);
      if(aPoints !== undefined && bPoints !== undefined){
        return bPoints - aPoints 
      }else {
        return 0
      }
    })
  }
}