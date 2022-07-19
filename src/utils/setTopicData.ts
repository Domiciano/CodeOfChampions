import { TopicDataSelect, TopicDataType } from "../types/classes";

export const handleDeleteActivity = (setTopics: (value: React.SetStateAction<TopicDataSelect[]>) => void, currentTopic: TopicDataType, activityIndex: number, profileActivityIndex: number) => {
  setTopics(prev => {
    const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
    let prevCopy = [...prev];
    prevCopy[topicIndex].activities[activityIndex].profileActivities.splice(profileActivityIndex, 1);
    return prevCopy;
  })
}