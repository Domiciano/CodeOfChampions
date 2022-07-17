import React, { useState } from 'react';
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

interface StudentViewInterface {
  studentUser: StudentType
}

const StudentView: React.FC<StudentViewInterface> = ({studentUser}) => {
  const userClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.userClasses)[0];
  const [activeMessages, setActiveMessages] = useState(studentUser.messages.length > 0);
  const dispatch = useDispatch();
  console.log(userClasses);
  
  const handleCloseMessageModal = () => {
    dispatch(deleteUserMessage(db, studentUser.id, studentUser.messages[0], () => {
      setActiveMessages(false);
    }))
  }  
  console.log(studentUser.messages)
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
    </div>
  )
}

export default StudentView