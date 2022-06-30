import React, { useEffect, useRef, useState } from 'react';
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
import { ProfileDataType, TopicDataType, ClassType } from '../../types/classes';
import { addNewClass } from '../../store/class-slice';


const CreateClass = () => {
  const loggedUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const [term, setTerm] = useState('');
  const [schedule, setSchedule] = useState('');
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileDataType[]>(data.profiles.map(profile => ({...profile, isChecked: false})));
  const [topics, setTopics] = useState<TopicDataType[]>(data.topics.map(profile => ({...profile, isChecked: false, activities: []})));
  const selectDropdownRef = useRef<any>();
  const dispatch = useDispatch();

  const handleToggleProfile = (currentProfile: ProfileDataType) => {
    setProfiles(prev => {
      const currentIndex = prev.findIndex(p => p.name === currentProfile.name);
      let prevCopy = [...prev];
      prevCopy[currentIndex].isChecked = !prevCopy[currentIndex].isChecked;
      return prevCopy;
    })
    // selectDropdownRef.current.close();
  };

  const handleToggleTopic = (currentTopic: TopicDataType) => {
    setTopics(prev => {
      const currentIndex = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[currentIndex].isChecked = !prevCopy[currentIndex].isChecked;
      return prevCopy;
    })
    // selectDropdownRef.current.close();
  };

  const setTopicsPlaceHolder = (data: TopicDataType[]) => {
    const text = data.filter(p => p.isChecked).map(p => p.name).join(', ');
    return text.length < 40 ? text : `${text.substring(0,40)}...`;
  }

  const addNewActivity = (currentTopic: TopicDataType) => {
    setTopics(prev => {
      const index = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[index].activities.push({rushMode: false})
      return prevCopy;
    })
  }

  const handleDeleteActivity = (currentTopic: TopicDataType, activityIndex: number) => {
    setTopics(prev => {
      const index = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[index].activities.splice(activityIndex, 1);
      return prevCopy;
    })
  }

  const handleToggleActivityMode = (currentTopic: TopicDataType, activityIndex: number) => {
    setTopics(prev => {
      const index = prev.findIndex(p => p.name === currentTopic.name);
      let prevCopy = [...prev];
      prevCopy[index].activities[activityIndex].rushMode = !prevCopy[index].activities[activityIndex].rushMode;
      return prevCopy;
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const classCreated: ClassType = {
      term: term,
      schedule: schedule,
      profiles: profiles.filter(p => p.isChecked),
      topics: topics.filter(t => t.isChecked),
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
            // const numberPattern = /\d+/g;
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
          <SelectDropDown ref={selectDropdownRef} placeholder={profiles.filter(p => p.isChecked).map(p => p.name).join(', ') || 'Select the profiles'}>
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
          <SelectDropDown ref={selectDropdownRef} placeholder={setTopicsPlaceHolder(topics) || 'Select the topics'}>
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
            topics.filter(p => p.isChecked).map(topic => (
              <div key={topic.name} className={styles['create-class__topics__topic']}>
                <h3>{topic.name}</h3>
                <div className={styles['create-class__topics__topic__action']}>
                  <p>Activities</p>
                  <button type="button" onClick={addNewActivity.bind(null, topic)}>
                    <img src={plusIcon} alt="plus" />
                  </button>
                </div>
                <div className={styles['create-class__topics__topic__activities']}>
                  {
                    topic.activities.map((activity, index) => (
                      <div key={Math.random().toFixed(3)} className={styles['create-class__topics__topic__activity-container']}>
                        <div className={styles['create-class__topics__topic__activity']}>
                          <p>{index + 1}. Activity</p>
                          <div 
                            className={styles['activity-mode']}
                            onClick={handleToggleActivityMode.bind(null, topic, index)}
                          >
                            <p>Rush Mode</p>
                            <CheckBox isActive={activity.rushMode}/>
                          </div>
                        </div>
                        <button type="button" onClick={handleDeleteActivity.bind(null, topic, index)}>
                          <img src={cancelIcon} alt="delete" />
                        </button>
                      </div>
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