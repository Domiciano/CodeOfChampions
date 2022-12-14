import React, {useEffect, useRef, useState} from 'react';
import uniqid from 'uniqid';
import { useParams, useNavigate } from 'react-router-dom';
import { StudentType, isStudentType } from '../../types/user';
import { ActivityState } from '../../types/classes';
import { getCurrentUser } from '../../utils/firebase-functions/getCurrentUser';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import { setUserDataFromObj } from '../../utils/firebase-functions/setUserDataFromObj';
import MainBtn from '../../components/MainBtn/MainBtn';
import Back from '../../components/Back/Back';
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import styles from './StudentTopicsDetail.module.css';
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import { updateStudentClassState } from '../../utils/firebase-functions/updateStudentClassState';
import { sendMessage } from '../../utils/firebase-functions/sendMessage';
import { useSelector } from 'react-redux';
import data from '../../data/profiles.json';
import { InitialStateType } from '../../store/class-slice';
import writeIcon from '../../img/svg/write.svg';
import cancelIcon from '../../img/svg/cancel.svg';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import Difficulty from '../../components/Difficulty/Difficulty';
import { updateSenpai } from '../../utils/firebase-functions/updateSenpai';

const activityStateOPtions: ActivityState[] = ["none", "complete", "almost"];

interface StudentTopicsDetailInterface {
  editing: boolean;
}

const StudentTopicsDetail: React.FC<StudentTopicsDetailInterface> = ({editing}) => {
  const [currentUser, setCurrentUser] = useState<StudentType | null>();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReferenceToAddComment, setCurrentReferenceToAddComment] = useState({
    topicIndex: 0,
    activityIndex: 0
  });
  const [commentValue, setCommentValue] = useState('');
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses);
  const { userId } = useParams();
  const navigate = useNavigate();
  const activityStateRef = useRef<any>();
  const currentUserClass = userClasses.find(uc => uc.classId === currentUser?.belongedClassId);
  
  const handleActivityState = (topicIndex: number, activityIndex: number, state: ActivityState) => {
    activityStateRef.current.close();
    setCurrentUser(prev => {
      if(!prev) return;
      const copyPrev = {...prev};
      copyPrev.classState.topics[topicIndex].topicActivities[activityIndex].state = state;
      copyPrev.classState.topics.forEach(topic => {
        const newTopicPoints = topic.topicActivities.reduce((previousValueActivity, currentValueActivity) => {
          return previousValueActivity + (data.activityStateOPtions.find(d => d.name === currentValueActivity.state)?.value || 0)
        }, 0);
        topic.topicPoints = newTopicPoints;
      });
      const newUserPoints = copyPrev.classState.topics.reduce((previousTopicPoints, currentTopicPoints) => {
        return previousTopicPoints + currentTopicPoints.topicPoints
      },0)
      copyPrev.classState.points = newUserPoints;
      return copyPrev;
    })
  }

  const openCommentModal = (topicIndex: number, activityIndex: number) => {
    setShowCommentModal(true)
    setCurrentReferenceToAddComment({
      topicIndex: topicIndex,
      activityIndex: activityIndex
    })
  }

  const handleDeleteComment = (topicIndex: number, activityIndex: number, commentIndex: number) => {
    setCurrentUser(prev => {
      if(!prev) return;
      const copyPrev = {...prev};
      copyPrev.classState.topics[topicIndex].topicActivities[activityIndex].comments.splice(commentIndex, 1);
      return copyPrev
    })
  }
  
  const handleUpdateStudent = () => {
    setIsLoading(true);
    if(!userId) return
    getCurrentUser(userId, db)
      .then(_currentUser => {
        const currentUserData = _currentUser.data();
        if(!currentUserData) return
        const studentData = setUserDataFromObj(currentUserData);
        if(!isStudentType(studentData)) return
        studentData?.classState.topics.forEach((t, tIndex) => {
          if(t.topicActivities.every(ta => ta.state === "complete")){
          }else if(currentUser?.classState.topics[tIndex].topicActivities.every(ta => ta.state === "complete")){
            sendMessage(db, userId, {
              code: "Congratulations",
              content: `You did a great job completing the level ${t.name} successfully`,
              id: uniqid()
            })
          }
        })
        if(currentUser){
          updateStudentClassState(db, currentUser?.id, currentUser.classState, () => {
            if(studentData.profile.name.toLocaleLowerCase() === "apprentice"){
              if(studentData.senpaiId && studentData.senpaiId !== ''){
                updateSenpai(db, studentData.senpaiId)
                  .then(() => {
                    navigate(`/class-detail/${currentUser?.belongedClassId}`);
                    setIsLoading(false);
                  })
              }else{
                navigate(`/class-detail/${currentUser?.belongedClassId}`);
                setIsLoading(false);
              }
            }else{
              //TODO: update the redux object regarding this class
              navigate(`/class-detail/${currentUser?.belongedClassId}`);
              setIsLoading(false);
            }
          })
        }
      })
  }

  useEffect(() => {
    setIsLoading(true);
    if(!userId) return
    if(userClasses.length === 0){
      navigate('/');
    }
    getCurrentUser(userId, db)
      .then(_currentUser => {
        const currentUserData = _currentUser.data();
        if(!currentUserData) {
          navigate("/");
        }else{
          const studentData = setUserDataFromObj(currentUserData);
          if(isStudentType(studentData)){
            setIsLoading(false);
            setCurrentUser(studentData);
          }
        }
      })
  }, [navigate, userClasses.length, userId]);

  const handleAddComment:React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setShowCommentModal(false);
    setCurrentUser(prev => {
      if(!prev) return;
      const copyPrev = {...prev};
      copyPrev?.classState?.topics[currentReferenceToAddComment.topicIndex]?.topicActivities[currentReferenceToAddComment.activityIndex]?.comments.push(commentValue);
      return copyPrev
    })
    setCommentValue('')
  }

  const onChangeTextarea:React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCommentValue(e.target.value);
  }
  
  return (
    <>
      <header className={styles['evaluate-student__header']}>
        <Back/>
        {editing && <MainBtn text={'Update'} action={handleUpdateStudent}/>}
      </header>
      <div className={styles['evaluate-student']}>
        {isLoading && <Loader/>}
        {showCommentModal && <Modal onCancelBtnAction={setShowCommentModal.bind(null, false)}>
          <div className={styles['add-comment-container']}>
            <textarea
              value={commentValue}
              onChange={onChangeTextarea}
            />
            <MainBtn text={'Add Comment'} action={handleAddComment}/>
          </div>
        </Modal>}
        
        {
          currentUser && 
          <StudentInfo 
            name={currentUser?.name} 
            profile={currentUser?.profile.name} 
            studentId={currentUser?.universityId}
            image={currentUserClass?.profiles.find(p => p.name.toLowerCase() === currentUser.profile.name.toLowerCase())?.img || ''}
          />
        }
        <form className={styles['form']} onSubmit={handleUpdateStudent}>
          <header className={styles['form__header']}>
            <h2>Topics</h2>
            <h3>Points: {currentUser?.classState.points}</h3>
          </header>
          <section className={styles['topics']}>
            {
              currentUser && currentUser.profile.name !== 'senpai' && 
              currentUser.classState.topics.map((topic, topicIndex) => (
                <div key={topic.name} className={styles['topic']}>
                  <h3>{topic.name}: {topic.topicPoints}</h3>
                  {topic.topicActivities.map((ta, taIndex) => {
                    const activityClassData = currentUserClass?.topics.find(t => t.name === topic.name)?.activities.find(a => a.profile === currentUser?.profile.name)?.profileActivities.find(pa => pa.activityId === ta.id);
                    return (
                      <article key={ta.id} className={styles['activity-container']}>
                        <div className={styles['activity']}>
                          <p 
                            className={styles['activity-tag']} 
                          >
                            {taIndex+1} {activityClassData?.name}
                          </p>
                          {editing && 
                            <SelectDropDown 
                              placeholder={ta.state} 
                              ref={activityStateRef}
                              style={{
                                border: ta.state === "complete" ?  "2px solid var(--app-color)" : "",
                              }}
                            >
                              {activityStateOPtions.map(activityState => (
                                <p className={styles['state-options']} onClick={handleActivityState.bind(null, topicIndex, taIndex, activityState)} key={activityState}>{activityState}</p>
                              ))}
                            </SelectDropDown>
                          }
                          {editing && 
                            <button
                              type='button' 
                              className={styles['comment-btn']}
                              onClick={openCommentModal.bind(null, topicIndex, taIndex)}
                            >
                              <img src={writeIcon} alt="write" />
                            </button>
                          }
                          {!editing && <h4 className={styles['activity-state']}>{ta.state}</h4>}
                        </div>
                        <div className={styles['activity-difficulty']}>
                          <p>Difficulty</p>
                          <Difficulty difficulty={activityClassData?.difficulty || 'easy'}/>
                        </div>
                        <ul className={styles['comments']}>
                          {ta.comments?.map((comment, i) => (
                            <div key={Math.random().toString()} className={styles['comment']}>
                              <li className={`${editing ? styles['comment--edition'] : ''}`}>{comment}</li>
                              {editing && 
                                <button
                                  type='button'
                                  onClick={handleDeleteComment.bind(null, topicIndex, taIndex, i)}
                                >
                                  <img src={cancelIcon} alt="" />
                                </button>
                              }
                            </div>
                          ))}
                        </ul>
                      </article>
                    )
                  })}
                </div>
              ))
            }
          </section>
        </form>
      </div>
    </>
  )
}

export default StudentTopicsDetail