import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import React, { useEffect, useRef, useState, useReducer } from 'react';
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
import { getActiveClasses, InitialStateType } from '../../store/class-slice';
import SelectProfiles from '../../components/SelectProfiles/SelectProfiles';
import { ProfileDataSelect, SelectClassType } from '../../types/classes';
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg';
import { initState } from './signUp-utils';
import Loader from '../../components/Loader/Loader';


const SignUp = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const role = new URLSearchParams(location.search).get('role');
  const navigate = useNavigate();
  const activeClasses = useSelector((state: {classSlice: InitialStateType}) => state?.classSlice.classesToSelect);
  const [classSelect, setClassSelect] = useState<SelectClassType | null>(null);
  const [classProfiles, setClassProfiles] = useState<ProfileDataSelect[]>([]);
  const [firebaseError, setFirebaseError] = useState('');
  const selectDropdownRef = useRef<any>();
  const dispatch = useDispatch();

  const [inputValues, dispatchFormValue] = useReducer(
    (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
    initState,
  )
  const {name, email, id, password, confirmPassword } = inputValues;

  const reducerInputChange = (variable: string, value: string) => {
    dispatchFormValue({ [variable] : {
      content: value,
      error: false
    } })
  }
  useEffect(() => {
    setIsLoading(true);
    if (!(role === 'teacher' || role === 'student')){
      navigate('/login')
    }
    dispatch(getActiveClasses(db, () => {
      setIsLoading(false);
    }));
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

  // * SUBMIT >>>>>>
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let userToPublish: StudentType | TeacherType;
    let allowPublish = true;
    Object.keys(inputValues).forEach((v) => {
      if (inputValues[v].content.toString().trim() === '') {
        allowPublish = false;
        dispatchFormValue({ [v] : {
          ...inputValues[v],
          error: true
        } })
      }
    })

    if (role === 'student' && !classSelect) {
      allowPublish = false;
    }

    if(role === 'student' && !classProfiles.some(c => c.isChecked)){
      allowPublish = false;
    }

    if(role === 'teacher'){
      userToPublish = {
        name: name.content,
        email: email.content,
        id: '',
        role: 'teacher',
        classesId: [],
        isVerified: false,
        universityId: id.content,
        messages: []
      }
    }else{
      userToPublish = {
        name: name.content,
        email: email.content,
        id: '',
        role: 'student',
        profile: {
          name: classProfiles.find(p => p.isChecked)?.name || "Apprentice"
        },
        belongedClassId: classSelect?.classId || '',
        universityId: id.content,
        messages: [],
        classState: {
          points: 0,
          topics: classSelect?.topics.map(topic => {
            if (classProfiles.find(p => p.isChecked)?.name === 'Killer') {
              return {
                name: topic.name,
                topicPoints: 0,
                topicActivities: topic.activities.find(t => t.profile === 'Killer')?.profileActivities.map(pa => ({
                  id: pa.activityId,
                  name: pa.name,
                  state: 'none',
                  activityPodium: 'none',
                  comments: []
                })) || []
              }
            }else {
              return {
                name: topic.name,
                topicPoints: 0,
                topicActivities: topic.activities.find(t => t.profile === 'Apprentice')?.profileActivities.map(pa => ({
                  id: pa.activityId,
                  name: pa.name,
                  state: 'none',
                  comments: []
                })) || []
              }
            }
          }) || []
        }
      }
    }

    if (allowPublish) {
      console.log(inputValues)
      dispatch(addNewUserToFirestore(db, userToPublish, auth, () => {
        console.log('done');
        if(role === 'teacher'){
          dispatch(logOutUser(auth, () => {
            navigate("/teacher-pending");
          }))
        }else{
          navigate('/');
        }
        setIsLoading(false);
      }, email.content, password.content, (error) => {
        console.log(error.code)
        setFirebaseError(error.message);
        setIsLoading(false);
      }));
    }else {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles['sign-up']}>
      {isLoading && <Loader/>}
      <div className={styles['sign-up__header']}>
        <Back/>
        <h1>Sign up, {role}</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles['sign-up__form']}>
        <div className={styles['sign-up__fields']}>
          { role === 'student' &&
            <div className={styles['class-dropdown']}>
              <p className={styles['class-dropdown__tag']}>Class</p>  
              <SelectDropDown 
                ref={selectDropdownRef} 
                placeholder={classSelect ? `${classSelect.teacherName} - ${classSelect.term}` : "Select a Class"}
              >
                <div className={styles['sign-up__classes']}>
                  {activeClasses.map( classData => {
                    const {term, schedule, classId, teacherName} = classData;
                    return <SelectClassThumbnail 
                    teacher={teacherName}
                    term={term}
                    schedule={schedule}
                    key={classId} 
                    onClick={handleClassThumbClick.bind(null, classData)}
                  />
                  })}
                </div>
              </SelectDropDown>
            </div>
          }
          <TextInput
            icon={<UserIcon style={styles["icon"]} />}
            onChangeInputValue={(value) => {
              reducerInputChange('name', value);
            }}
            placeholder="Write your name"
            label="Name"
            value={name.content}
            isError={name.error}
          />
          <TextInput
            icon={<EmailIcon style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              reducerInputChange('email', value);
            }}
            placeholder="Write your Email"
            label="Email"
            value={email.content}
            isError={email.error}
          />
          <TextInput
            icon={<UserIcon style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              reducerInputChange('id', value);
            }}
            placeholder="Write your ID"
            label="Icesi's ID"
            value={id.content}
            isError={id.error}
          />
          <TextInput
            icon={<Lock style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              reducerInputChange('password', value);
            }}
            placeholder="Write your password"
            label="Password"
            value={password.content}
            isError={password.error}
            isPassword
          />
          <TextInput
            icon={<Lock style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              reducerInputChange('confirmPassword', value);
            }}
            placeholder="confirm your password"
            label="Confirm Password"
            value={confirmPassword.content}
            isError={confirmPassword.error}
            isPassword
          />
          {role === 'student' && classSelect && <SelectProfiles handleChooseProfile={handleChooseProfile} profilesData={classProfiles}/>}
        </div>
        <div className={styles['sign-up__footer']}>
          {firebaseError !== '' && <ErrorMsg message={firebaseError}/>}
          <MainBtn text="Sign Up" action={() => {}} />
          <p>Already have an account? <b onClick={() => {navigate('/login')}}>Login</b></p>
        </div>
      </form>
    </div>
  )
}

export default SignUp
