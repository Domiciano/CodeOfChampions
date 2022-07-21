import React, { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import LogOut from '../../components/LogOut/LogOut';
import { StudentType } from "../../types/user";
import StudentInfo from '../../components/StudentInfo/StudentInfo';
import { useSelector, useDispatch } from "react-redux";
import { InitialStateType } from '../../store/class-slice';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import MessageModal from '../../components/MessageModal/MessageModal';
import Modal from '../../components/Modal/Modal';
import MainBtn from '../../components/MainBtn/MainBtn';
import styles from './StudentView.module.css';
import {deleteUserMessage} from '../../store/userAuth-slice';
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import { getStudentsFromClass } from '../../utils/firebase-functions/getStudentsFromClass';
import UserThumbNail from '../../components/UserThumbNail/UserThumbNail';
import SenseiActions from '../../components/SenseiActions/SenseiActions';
import { getSenseiStudents } from '../../utils/firebase-functions/getSenseiStudents';

interface StudentViewInterface {
  studentUser: StudentType
}

const StudentView: React.FC<StudentViewInterface> = ({studentUser}) => {
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses)[0];
  const [currentTopicRanking, setCurrentTopicRanking] = useState('');
  const [classUsers, setClassUsers] = useState<StudentType[]>([]);
  const [senseiStudents, setSenseiStudents] = useState<StudentType[]>([]);
  const [activeMessages, setActiveMessages] = useState(studentUser.messages.length > 0);
  const dispatch = useDispatch();
  const selectDropdownRef = useRef<any>();

  const handleCloseMessageModal = () => {
    dispatch(deleteUserMessage(db, studentUser.id, studentUser.messages[0], () => {
      setActiveMessages(false);
    }))
  }

  const getUserTopicPoints = (user: StudentType, topic: string) =>{
    return  user.classState.topics.find(t => t.name === topic)?.topicPoints;
  }

  const setUsersSortByTopic = useCallback((users: StudentType[], topic: string) => {
    return users.sort((a, b) => {
      const aPoints = getUserTopicPoints(a, topic);
      const bPoints = getUserTopicPoints(b, topic);
      if(aPoints !== undefined && bPoints !== undefined){
        return bPoints - aPoints 
      }else {
        return 0
      }
    })
  }, [])

  const handleSetTopicRanking = (topic: string) => {
    setCurrentTopicRanking(topic);
    setClassUsers(prev => setUsersSortByTopic(prev, topic));
    selectDropdownRef.current.close();
  }
  console.log('xd');
  useEffect(() => {
    if(!userClasses) return
    setCurrentTopicRanking(userClasses.topics[0].name)
    getStudentsFromClass(db, userClasses.classId)
    .then(usersData => {
      setClassUsers(setUsersSortByTopic(usersData.filter(user => user.profile.name === studentUser.profile.name), userClasses.topics[0].name));
    })
  }, [setUsersSortByTopic, studentUser.profile, userClasses]);
  useEffect(() => {
    getSenseiStudents(db, studentUser.id)
      .then(usersData => {
        setSenseiStudents(usersData);
      })
  }, [studentUser])
  return (
    <div className={styles['student-view']}>
      { studentUser.messages.length > 0 && activeMessages &&(
        <Modal onCancelBtnAction={handleCloseMessageModal}>
          <article className={styles['message-container']}>
            <MessageModal message={studentUser.messages[0]}/>
            <MainBtn text={'Continue'} action={handleCloseMessageModal}/>
          </article>
        </Modal>
      )}
      <LogOut/>
      <StudentInfo 
        name={studentUser.name} 
        profile={studentUser.profile.name}
        studentId={studentUser.universityId}
      />
      <ProgressBar student={studentUser}/>
      {studentUser.profile.name !== 'Sensei' &&
        <div className={styles['ranking-container']}>
          <h3 className={styles['ranking-title']}>Ranking per Topic</h3>
          <SelectDropDown placeholder={currentTopicRanking} ref={selectDropdownRef}>
            <div>
              { userClasses &&
                userClasses.topics.map(topic => (
                  <p 
                    key={topic.name}
                    className={styles['profile']}
                    onClick={handleSetTopicRanking.bind(null, topic.name)}
                  >
                    {topic.name}
                  </p>
                ))
              }
            </div>
          </SelectDropDown>
          <div className={styles['ranking-users']}>
            {classUsers &&
              classUsers.map((user, index) => (
                <UserThumbNail 
                  key={user.id} 
                  rank={index + 1} 
                  name={user.name} 
                  studentId={user.universityId} 
                  points={getUserTopicPoints(user, currentTopicRanking) || 0} 
                  isTeacher={false}
                  id={user.id}
                />
              ))
            }
          </div>
        </div>
      }
      {studentUser.profile.name === 'Sensei' && userClasses && <SenseiActions userClass={userClasses} userId={studentUser.id}/>}
      {studentUser.profile.name === 'Sensei' && studentUser.studentsId && (
        <div className={styles['sensei-students']}>
          <h3 className={styles['sensei-students__title']}>Apprentices</h3>
          {senseiStudents.map((student, index) => (
            <UserThumbNail 
              key={student.id} 
              rank={index + 1} 
              name={student.name} 
              studentId={student.universityId} 
              points={student.classState.points} 
              isTeacher={false}
              id={student.id}
              listItem={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentView