import React, { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import styles from './CreateClass.module.css';
import Back from '../../components/Back/Back';
import { useSelector, useDispatch } from 'react-redux';
import { userAuthInitStateType } from '../../store/userAuth-slice';
import { useNavigate } from "react-router-dom";
import TextInput from '../../components/TextInput/TextInput';
import MainBtn from '../../components/MainBtn/MainBtn';
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import data from '../../data/profiles.json';
import CheckBox from '../../components/CheckBox/CheckBox';
import plusIcon from '../../img/svg/plus.svg';
import cancelIcon from '../../img/svg/cancel.svg';
import { 
  ProfileDataType, 
  ClassType, 
  ProfileDataSelect, 
  TopicDataSelect, 
  ActivityType, 
  Difficulty 
} from '../../types/classes';
import { addNewClass } from '../../store/class-slice';

const DIFFICULTIES: Difficulty[]  = [
  'easy',
  'medium',
  'hard'
];

const CreateClass = () => {
  const loggedUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const [term, setTerm] = useState('');
  const [schedule, setSchedule] = useState('');
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileDataSelect[]>(data.profiles.map(profile => ({...profile, isChecked: false})));
  const [topics, setTopics] = useState<TopicDataSelect[]>(data.topics.map(profile => ({...profile, isChecked: false, activities: []})));
  const profilesSelectDropdownRef = useRef<any>();
  const topicsSelectDropdownRef = useRef<any>();
  const levelDifficultySelectDropdownRef = useRef<any>();
  const dispatch = useDispatch();

  const handleToggleProfile = (currentProfile: ProfileDataType) => {
    setProfiles(prev => {
      const currentIndex = prev.findIndex(p => p.name === currentProfile.name);
      let prevCopy = [...prev];
      prevCopy[currentIndex].isChecked = !prevCopy[currentIndex].isChecked;
      return prevCopy;
    })
  };

  const handleToggleTopic = (currentTopic: TopicDataSelect) => {
    setTopics(prev => {
      const currentIndex = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[currentIndex].isChecked = !prevCopy[currentIndex].isChecked;
      // TODO: Change this to state way, currently not handling nicely
      profiles.forEach(p => {
        if (!p.hasActivities || !p.isChecked || prevCopy[currentIndex].activities.some(profile => profile.profile === p.name)) return
        prevCopy[currentIndex].activities.push({
          profile: p.name,
          profileActivities: []
        })
      })
      return prevCopy;
    })
  };

  const setTopicsPlaceHolder = (data: TopicDataSelect[]) => {
    const text = data.filter(p => p.isChecked).map(p => p.name).join(', ');
    return text.length < 40 ? text : `${text.substring(0,40)}...`;
  }

  const addNewActivity = (currentTopic: TopicDataSelect, currentActivity: ActivityType) => {
    setTopics(prev => {
      const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      const activityIndex = prevCopy[topicIndex].activities.findIndex(p => p.profile === currentActivity.profile);
      const currentProfileActivity = prevCopy[topicIndex].activities[activityIndex];
      currentProfileActivity.profileActivities.push({
        difficulty: 'easy',
        podiumFirst: '',
        podiumSecond: '',
        podiumThird: '',
        activityId: uniqid(),
      })
      return prevCopy;
    })
  }

  const handleDeleteActivity = (currentTopic: TopicDataSelect, activityIndex: number, profileActivityIndex: number) => {
    setTopics(prev => {
      const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[topicIndex].activities[activityIndex].profileActivities.splice(profileActivityIndex, 1);
      return prevCopy;
    })
  }

  const handleSetDifficulty = (currentTopic: TopicDataSelect, activityIndex: number, profileActivityIndex: number, difficulty: Difficulty) => {
    setTopics(prev => {
      const topicIndex = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[topicIndex].activities[activityIndex].profileActivities[profileActivityIndex].difficulty = difficulty;
      return prevCopy;
    })
  }

  // TODO: Add the class to firestore
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const classCreated: ClassType = {
      term: term,
      schedule: schedule,
      profiles: profiles.filter(p => p.isChecked).map(p => (
        {
          description: p.description, 
          hasActivities: p.hasActivities, 
          img: p.img, 
          name: p.name
        }
      )),
      topics: topics.filter(t => t.isChecked).map(t => (
        {
          activities: t.activities,
          name: t.name
        }
      )),
      teacherId: loggedUser?.id || 'NO ID',
      classId: '',
      isActive: true,
      studentsId: []
    }
    console.log(classCreated);
    dispatch(addNewClass(db, classCreated, () => {navigate("/")}));
  }

  useEffect(() => {
    if(!isFetchingCurrentUser){
      // * At this moment, the fetch process is finished
      // TODO: Check if there is a user login
      if(!loggedUser){
        navigate("/login");
      }else if(loggedUser.role === "student") {
        navigate("/");
      }
    } 
  }, [isFetchingCurrentUser, loggedUser, navigate]);
  
  return (
    <div className={styles['create-class']}>
      <header className={styles['create-class__header']}>
        <Back/>
        <h2>Create new class</h2>
      </header>
      <form onSubmit={handleSubmit} className={styles['create-class__form']}>
        <TextInput
          onChangeInputValue={(value: string) => {
            setTerm(value);
          }}
          placeholder="Year/Half  e.i: 2021/1"
          label="Semester Term"
          value={term}
        />
        <TextInput
          onChangeInputValue={(value: string) => {
            setSchedule(value);
          }}
          placeholder="Day-Hour"
          label="Schedule"
          value={schedule}
        />
        <div className={styles['create-class__classes__select']}>
          <p className={styles['create-class__classes__select__label']}>Profiles</p>
          <SelectDropDown 
            ref={profilesSelectDropdownRef} 
            placeholder={profiles.filter(p => p.isChecked).map(p => p.name).join(', ') || 'Select the profiles'}
          >
            <div>
              {profiles.map( profileData => (
                <article 
                  onClick={handleToggleProfile.bind(null, profileData)}
                  key={profileData.name} 
                  className={styles['profile']}
                >
                  <CheckBox isActive={profileData.isChecked}/>
                  <p>{profileData.name}</p>
                </article>
              ))}
            </div>
          </SelectDropDown>
        </div>
        <div className={styles['create-class__classes__select']}>
          <p className={styles['create-class__classes__select__label']}>Topics</p>
          <SelectDropDown 
            ref={topicsSelectDropdownRef} 
            placeholder={setTopicsPlaceHolder(topics) || 'Select the topics'}
            allowActive={profiles.some(p => p.isChecked)}
          >
            <div>
              {topics.map( topicsData => (
                <article 
                  onClick={handleToggleTopic.bind(null, topicsData)}
                  key={topicsData.name} 
                  className={styles['profile']}
                >
                  <CheckBox isActive={topicsData.isChecked}/>
                  <p>{topicsData.name}</p>
                </article>
              ))}
            </div>
          </SelectDropDown>
        </div>
        <div className={styles['create-class__topics']}>
          {
            topics.filter(p => p.isChecked).map((topic, topicIndex) => (
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
                              <div key={Math.random().toFixed(5)} className={styles['create-class__topics__topic__activity-container']}>
                                <div className={styles['create-class__topics__topic__activity']}>
                                  <p>{index + 1}. Activity</p>
                                  <SelectDropDown ref={levelDifficultySelectDropdownRef} placeholder={topics[topicIndex].activities[currentActivityIndex].profileActivities[index].difficulty}>
                                    <div className={styles['create-class__topics__topic__activity__difficulty']}>
                                      {DIFFICULTIES.map(d => <p key={d} onClick={handleSetDifficulty.bind(null, topic, currentActivityIndex, index, d)}>{d}</p>)}
                                    </div>
                                  </SelectDropDown>
                                </div>
                                <button type="button" onClick={handleDeleteActivity.bind(null, topic, currentActivityIndex, index)}>
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
        <div className={styles['submit']}>
          <MainBtn text="Create Class" action={() => {}} />
        </div>
      </form>
    </div>
  )
}

export default CreateClass