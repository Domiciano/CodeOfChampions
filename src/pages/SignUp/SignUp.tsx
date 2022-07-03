import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
import { addNewUserToFirestore, logOutUser } from '../../store/userAuth-slice';
import { InitialStateType } from '../../store/class-slice';
import SelectProfiles from '../../components/SelectProfiles/SelectProfiles';
import { SelectClassType, ProfileDataType } from '../../types/classes';

const SignUp = () => {
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role');
  const navigate = useNavigate();
  const activeClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.classesToSelect);
  const [classSelect, setClassSelect] = useState<SelectClassType | null>(null);
  const [name, setName] = useState('');
  const [classProfiles, setClassProfiles] = useState<ProfileDataType[]>([]);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const selectDropdownRef = useRef<any>();
  const dispatch = useDispatch();


  useEffect(() => {
    if (!(role === 'teacher' || role === 'student')){
      navigate('/login')
    }
    
  }, [dispatch, navigate, role])

  const handleClassThumbClick = (classData: SelectClassType) => {
    setClassSelect(classData);
    setClassProfiles(classData.profiles.map(profile => ({...profile, isChecked: false})))
    selectDropdownRef.current.close();
  }

  const handleChooseProfile = (index: number) => {
    setClassProfiles(prev => {
      const profilesCopy = prev.map(profile => ({...profile, isChecked: false}));
      profilesCopy[index].isChecked = true;
      return profilesCopy;
    })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
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
        role: 'student',
        profile: classProfiles.find(p => p.isChecked)?.name || "apprentice",
        points: 0,
        belongedClassId: classSelect?.classId || '',
      }
    }

    dispatch(addNewUserToFirestore(db, userToPublish, auth, () => {
      console.log('done');
      if(role === 'teacher'){
        dispatch(logOutUser(auth, () => {
          navigate("/teacher-pending");
        }))
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
                {activeClasses.map( classData => <SelectClassThumbnail 
                  teacher={classData.teacherName}
                  term={classData.term}
                  schedule={classData.schedule}
                  key={classData.classId} 
                  onClick={handleClassThumbClick.bind(null, {
                    term: classData.term,
                    schedule: classData.schedule,
                    profiles: classData.profiles,
                    topics: classData.topics,
                    teacherId: classData.teacherId,
                    classId: classData.classId,
                    isActive: classData.isActive,
                    studentsId: classData.studentsId,
                    teacher: classData.teacherName,
                  })}
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
          {role === 'student' && classSelect && <SelectProfiles handleChooseProfile={handleChooseProfile} profilesData={classProfiles}/>}
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
