import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainBtn from "../../components/MainBtn/MainBtn";
import TextInput from "../../components/TextInput/TextInput";
import Email from "../../components/UI/EmailIcon/EmailIcon";
import Lock from "../../components/UI/Lock/Lock";
import styles from "./Login.module.css";
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import { logUserAsync } from "../../store/userAuth-slice";
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg';
import { useNavigate } from "react-router-dom";
import { userAuthInitStateType } from '../../store/userAuth-slice';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(email, password);
    dispatch(logUserAsync(auth, db, email, password, () =>{
      navigate('/');
    }, (errorCode, errorMessage) => {
      console.log(errorCode, errorMessage);
      setErrorMessage(errorMessage.split('/')[1].replace(').', '').replace('-', ' '));
    }))
  }
  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit}>
        <div className={styles['inputs']}>
          <TextInput
            icon={<Email style={styles["icon"]} />}
            onChangeInputValue={(value: string) => {
              setEmail(value);
            }}
            placeholder="Write your email"
            label="Email"
            value={email}
            isError={errorMessage !== ''}
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
            isError={errorMessage !== ''}
          />
          { errorMessage !== '' && <ErrorMsg message={errorMessage}/> }
        </div>
        <div className={styles['footer']}>
          <MainBtn text="Login" action={() => {}} />
          <p>Don't have an account? <b>Create</b></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
