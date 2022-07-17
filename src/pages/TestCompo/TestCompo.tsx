import React, { useState, useRef } from 'react';
import styles from './TestCompo.module.css';
import MainBtn from '../../components/MainBtn/MainBtn';
import Arrow from '../../components/UI/Arrow/Arrow';
import UserIcon from '../../components/UI/UserIcon/UserIcon';
import Email from '../../components/UI/EmailIcon/EmailIcon';
import Lock from '../../components/UI/Lock/Lock';
import TextInput from '../../components/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import SelectDropDown from '../../components/SelectDropDown/SelectDropDown';
import ClassThumbNail from '../../components/ClassThumbNail/ClassThumbNail';
import SearchBar from '../../components/SearchBar/SearchBar';
import UserThumbNail from '../../components/UserThumbNail/UserThumbNail';
import CheckBox from '../../components/CheckBox/CheckBox';
import LogOut from '../../components/LogOut/LogOut';

const TestCompo = () => {
  const [modalActive, setModalActive] = useState(false);
  const [profilesSelect, setProfilesSelect] = useState({
    learning: false,
    killer: false,
    apprentice: false
  });
  const [textInputs, setTextInputs] = useState([
    {
      value: 'holi',
      id: 1
    },
    {
      value: 'holi2',
      id: 2
    },
    {
      value: 'holi3',
      id: 3
    },
  ])
  const selectDropdownRef = useRef<any>();
  return (
    <div className={styles.login}>
      {
        textInputs.map((t, i) => (
          <input type="text" key={t.id} value={t.value} onChange={(e) => {
            setTextInputs(prev => {
              const copy = [...prev];
              copy[i].value = e.target.value;
              return copy
            })
          }}/>
        ))
      }
      <LogOut/>
      <MainBtn text="Login" action={() => {setModalActive(true)}}/>
      <div>
        <Arrow/>
        <UserIcon style={styles['user']}/>
        <Email/>
        <Lock/>
      </div>
      <TextInput 
        icon={<Lock style={styles['icon']} />} 
        onChangeInputValue={(value: string) => {
          // console.log(value)
        }}
        placeholder="Write a strong password"
        label="Password"
        value=''
      />
      {modalActive && <Modal onCancelBtnAction={ () => {setModalActive(false)}} >
        <p>sipppp</p>
        <MainBtn text="Click me" action={() => {}}/>
      </Modal>}
      <SearchBar/>
      <SelectDropDown ref={selectDropdownRef} placeholder="Select a Class">
        {/* <MainBtn text="Click me" action={() => {
          selectDropdownRef.current.close();
        }}/> */}
        <div className={styles.profiles}>
          <div className={styles.profile} onClick={() => {
            setProfilesSelect(prev => {
              return {...prev, learning: !prev.learning}
            })
          }}>
            <CheckBox isActive={profilesSelect.learning}/>
            <p>Learning</p>
          </div>
          <div className={styles.profile} onClick={() => {
            setProfilesSelect(prev => {
              return {...prev, killer: !prev.killer}
            })
          }}>
            <CheckBox isActive={profilesSelect.killer}/>
            <p>Killer</p>
          </div>
          <div className={styles.profile} onClick={ () => {
            setProfilesSelect(prev => {
              return {...prev, apprentice: !prev.apprentice}
            })
          }}>
            <CheckBox isActive={profilesSelect.apprentice}/>
            <p>Apprentice</p>
          </div>
        </div>
      </SelectDropDown>
      <UserThumbNail rank={1} name={''} studentId={''} points={0} isTeacher={false} id={''}/>
      <UserThumbNail rank={2} name={''} studentId={''} points={0} isTeacher={false} id={''}/>
      <UserThumbNail rank={3} name={''} studentId={''} points={0} isTeacher={true} id={''}/>
      <UserThumbNail rank={4} name={''} studentId={''} points={0} isTeacher={true} id={''}/>
      <ClassThumbNail 
        isActive={true}
        term='2022/2' 
        schedule='Thursday, Wednesday, 7am-9am' 
        studentsQuantity={31}
        id={''}
      />
      <ClassThumbNail 
        isActive={false}
        term='2021/1' 
        schedule='Thursday, Wednesday, 7am-9am' 
        studentsQuantity={21}
        id={''}
      />
    </div>
  )
}

export default TestCompo