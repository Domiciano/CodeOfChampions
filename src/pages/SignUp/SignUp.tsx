import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import { StudentType, TeacherType } from "../../types/user";
import styles from './SignUp.module.css';
import Back from '../../components/Back/Back';
import {useLocation, useNavigate} from "react-router-dom";
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import SelectClassThumbnail from '../../components/SelectClassThumbnail/SelectClassThumbnail';
import TextInput from '../../components/TextInput/TextInput';
import EmailIcon from '../../components/UI/EmailIcon/EmailIcon';
import UserIcon from '../../components/UI/UserIcon/UserIcon';
import Lock from '../../components/UI/Lock/Lock';
import MainBtn from '../../components/MainBtn/MainBtn';
import { addNewUserToFirestore } from '../../store/userAuth-slice';

const SignUp = () => {
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role');
  const navigate = useNavigate();
  const [classSelect, setClassSelect] = useState<{teacher: string, term: string, schedule: string, classId: string} | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const selectDropdownRef = useRef<any>();
  const dispatch = useDispatch();

  const DUMMY_CLASSES = [
    {
      teacher: '1 Jose Luis',
      term: '2022/2',
      schedule: 'Martes, Miercoles, 7am - 9am',
      classId: '1'
    },
    {
      teacher: '2 Jose Luis',
      term: '2022/2',
      schedule: 'Martes, Miercoles, 7am - 9am',
      classId: '2'
    },
    {
      teacher: '3 Jose Luis',
      term: '2022/2',
      schedule: 'Martes, Miercoles, 7am - 9am',
      classId: '3'
    },
    {
      teacher: '4 Jose Luis',
      term: '2022/2',
      schedule: 'Martes, Miercoles, 7am - 9am',
      classId: '4'
    }
  ]
  
  useEffect(() => {
    if (!(role === 'teacher' || role === 'student')){
      navigate('/login')
    }
  }, [navigate, role])

  const handleClassThumbClick = (classData: {teacher: string, term: string, schedule: string, classId: string}) => {
    setClassSelect(classData);
    selectDropdownRef.current.close();
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(classSelect?.classId, name, email, id, password, confirmPassword);
    let userToPublish: StudentType | TeacherType;
    if(role === 'teacher'){
      userToPublish = {
        name,
        email,
        id: '',
        role: 'teacher',
        classesId: [],
        isVerified: false
      }
    }else{
      userToPublish = {
        name,
        email,
        id: '',
        role: 'teacher',
        classesId: [],
        isVerified: false
      }
    }
    dispatch(addNewUserToFirestore(db, userToPublish, auth, () => {
      console.log('done');
      if(role === 'teacher'){
        navigate('/teacher-pending');
      }else{
        navigate('/');
      }
    }, email, password));
  }

  return (
    <div className={styles['sign-up']}>
      <div className={styles['sign-up__header']}>
        <Back/>
        <h1>Sign up, {role}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles['sign-up__form']}>
        <div className={styles['sign-up__fields']}>
          { role === 'student' &&
            <SelectDropDown ref={selectDropdownRef} placeholder={classSelect ? `${classSelect.teacher} - ${classSelect.term}` : "Select a Class"}>
            <div className={styles['sign-up__classes']}>
              {DUMMY_CLASSES.map( classData => <SelectClassThumbnail 
                teacher={classData.teacher}
                term={classData.term}
                schedule={classData.schedule}
                key={classData.classId} 
                onClick={handleClassThumbClick.bind(null, classData)}
              />)}
            </div>
          </SelectDropDown>
          }
          <TextInput
            icon={<UserIcon style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setName(value);
            }}
            placeholder="Write your name"
            label="Name"
            value={name}
          />
          <TextInput
            icon={<EmailIcon style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setEmail(value);
            }}
            placeholder="Write your Email"
            label="Email"
            value={email}
          />
          <TextInput
            icon={<UserIcon style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setId(value);
            }}
            placeholder="Write your ID"
            label="Icesi's ID"
            value={id}
          />
          <TextInput
            icon={<Lock style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setPassword(value);
            }}
            placeholder="Write your password"
            label="Password"
            value={password}
            isPassword
          />
          <TextInput
            icon={<Lock style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setConfirmPassword(value);
            }}
            placeholder="confirm your password"
            label="Confirm Password"
            value={confirmPassword}
            isPassword
          />
        </div>
        <div className={styles['sign-up__footer']}>
          <MainBtn text="Sign Up" action={() => {}} />
          <p>Already have an account? <b onClick={() => {navigate('/login')}}>Login</b></p>
        </div>
      </form>

    </div>
  )
}

export default SignUp
