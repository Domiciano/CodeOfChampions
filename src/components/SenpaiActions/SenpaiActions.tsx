import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase-functions/getFirebaseInit';
import MainBtn from '../MainBtn/MainBtn';
import Modal from '../Modal/Modal';
import { ClassType } from "../../types/classes";
import { getStudentsFromClass } from '../../utils/firebase-functions/getStudentsFromClass';
import { StudentType } from '../../types/user';
import { useDispatch } from 'react-redux';
import CheckBox from '../CheckBox/CheckBox';
import styles from './SenpaiActions.module.css';
import { pairingApprenicesenpai } from '../../store/class-slice';

interface SenpaiActionsInterface {
  userClass: ClassType,
  userId: string
}

type StudentChecked = StudentType & {
  isChecked: boolean
}

const SenpaiActions: React.FC<SenpaiActionsInterface> = ({userClass, userId}) => {
  const [modalActive, setModalActive] = useState(false);
  const [classUsers, setClassUsers] = useState<StudentChecked[]>([]);
  const dispatch = useDispatch();

  const handleToggleMessageModal = () => {
    setModalActive(prev => !prev)
  }

  const handleCheckStudent = (studentIndex: number) => {
    console.log(classUsers[studentIndex]);
    setClassUsers(prev => {
      const copy = [...prev];
      copy[studentIndex].isChecked = !copy[studentIndex].isChecked;
      return copy;
    })
  }

  const handleSubmit = () => {
    console.log(classUsers.filter(student => student.isChecked))
    const selectedStudents = classUsers.filter(student => student.isChecked).map(s => s.id);
    dispatch(pairingApprenicesenpai(db, userId, selectedStudents, () => {
      handleToggleMessageModal();
    }))
    
  }

  useEffect(() => {
    getStudentsFromClass(db, userClass.classId)
    .then(usersData => {
      setClassUsers(usersData.filter(user => {
        console.log(user.senpaiId, 'sd')
        return (
          user.profile.name === 'Apprentice' &&
          user.senpaiId === ''
        )
      }).map(s => ({...s, isChecked: false})));
    })
  }, [userClass]);

  return (
    <div>
      {
        modalActive && 
        <Modal onCancelBtnAction={handleToggleMessageModal}>
          {classUsers.length > 0 && <>
            <div className={styles['user-to-select-container']}>
              {
                classUsers.map((user, userIndex) => (
                  <div 
                    className={styles['user-to-select']}
                    key={user.id}
                    onClick={handleCheckStudent.bind(null, userIndex)}
                  >
                    <CheckBox isActive={user.isChecked}/>
                    <p>{user.name}</p>
                  </div>
                ))
              }
            </div>
            <MainBtn text={'Accept'} action={handleSubmit}/>
          </>}
          {classUsers.length === 0 &&
            <div className={styles['no-apprentices']}>
              <h2>No Available Apprentices </h2>
            </div>
          }
        </Modal>
      }
      <MainBtn text={'Adopt Apprentices'} action={handleToggleMessageModal}/>
    </div>
  )
}

export default SenpaiActions