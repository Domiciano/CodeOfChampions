import React from 'react'
import { ActivityType, Difficulty, TopicDataType } from '../../types/classes';
import SelectDropDown from '../SelectDropDown/SelectDropDown';
import TextInput from '../TextInput/TextInput';
import styles from './EditTopics.module.css';
import plusIcon from '../../img/svg/plus.svg'
import cancelIcon from '../../img/svg/cancel.svg';

const DIFFICULTIES: Difficulty[]  = [
  'easy',
  'medium',
  'hard'
];

interface EditTopicsInterface {
  topics: TopicDataType[],
  addNewActivity: (currentTopic: TopicDataType, currentActivity: ActivityType) => void,
  handleChangeActivityName: (currentTopicIndex: number, activityIndex: number, profileActivityIndex: number, name: string) => void
  levelDifficultySelectDropdownRef: React.MutableRefObject<any>,
  handleSetDifficulty: (currentTopic: TopicDataType, activityIndex: number, profileActivityIndex: number, difficulty: Difficulty) => void,
  handleDeleteActivity: (currentTopic: TopicDataType, activityIndex: number, profileActivityIndex: number) => void,

}

const EditTopics: React.FC<EditTopicsInterface> = ({topics, addNewActivity, handleChangeActivityName, levelDifficultySelectDropdownRef, handleSetDifficulty, handleDeleteActivity}) => {
  return (
    <div className={styles['create-class__topics']}>
      {
        topics.map((topic, topicIndex) => (
          <div key={topic.name} className={styles['create-class__topics__topic']}>
            <h3>{topic.name}</h3>
            <div className={styles['create-class__topics__topic__action']}>
              {
                topic.activities.map((currentActivity, currentActivityIndex ) => (
                  <article 
                    key={currentActivity.profile}
                    className={styles['activities-container']}
                  >
                    <header>
                      <h4>{currentActivity.profile} <b style={{color: 'var(--second-white)'}}>activities</b></h4>
                      <button type="button" onClick={addNewActivity.bind(null, topic, currentActivity)}>
                        <img src={plusIcon} alt="plus" />
                      </button>
                    </header>
                    <div className={styles['create-class__topics__topic__activities']}>
                      {
                        currentActivity.profileActivities.map((activity, index) => (
                          <div key={activity.activityId} className={styles['create-class__topics__topic__activity-container']}>
                            <div className={styles['create-class__topics__topic__activity']}>
                              <div className={styles['activity-info']}>
                                <h4>{index + 1}</h4>
                                <TextInput
                                  onChangeInputValue={(value: string) => {
                                    handleChangeActivityName(topicIndex, currentActivityIndex, index, value);
                                  }}
                                  placeholder=""
                                  label=""
                                  value={activity.name}
                                />
                              </div>
                              <SelectDropDown ref={levelDifficultySelectDropdownRef} placeholder={topics[topicIndex].activities[currentActivityIndex].profileActivities[index].difficulty}>
                                <div className={styles['create-class__topics__topic__activity__difficulty']}>
                                  {DIFFICULTIES.map(d => <p key={d} onClick={handleSetDifficulty.bind(null, topic, currentActivityIndex, index, d)}>{d}</p>)}
                                </div>
                              </SelectDropDown>
                            </div>
                            <button className={styles['delete-button']} type="button" onClick={handleDeleteActivity.bind(null, topic, currentActivityIndex, index)}>
                              <img src={cancelIcon} alt="delete" />
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  </article>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default EditTopics