import React, { useState, useRef } from 'react';
import styles from './Login.module.css';
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

const Login = () => {
  const [modalActive, setModalActive] = useState(false);
  const selectDropdownRef = useRef<any>();
  return (
    <div className={styles.login}>
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
      />
      {modalActive && <Modal onCancelBtnAction={ () => {setModalActive(false)}} >
        <p>sipppp</p>
        <MainBtn text="Click me" action={() => {}}/>
      </Modal>}
      <SearchBar/>
      <SelectDropDown ref={selectDropdownRef} placeholder="Select a Class">
        <h1>ok ok</h1>
        <MainBtn text="Click me" action={() => {
          selectDropdownRef.current.close();
        }}/>
      </SelectDropDown>
      <ClassThumbNail/>
      <ClassThumbNail/>
      <ClassThumbNail/>
      <ClassThumbNail/>
    </div>
  )
}

export default Login