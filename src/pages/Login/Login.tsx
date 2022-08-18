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
import { useNavigate, Link } from "react-router-dom";
import { userAuthInitStateType } from '../../store/userAuth-slice';
import Modal from '../../components/Modal/Modal';
import Arrow from '../../components/UI/Arrow/Arrow';
import sistemasLogo from '../../img/sistemas.png';
import appLogo from '../../img/svg/logo.svg';
import Loader from '../../components/Loader/Loader';


const Login = () => {
  const [modalActive, setModalActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(isLoggedIn){
      navigate("/");
    }
  }, [isFetchingCurrentUser, isLoggedIn, navigate])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(logUserAsync(auth, db, email, password, () =>{
      setIsLoading(false);
      navigate('/');
    }, (errorCode, errorMessage) => {
      setErrorMessage(errorMessage.split('/')[1].replace(').', '').replace('-', ' '));
      setIsLoading(false)
    }))
  }
  return (
    <div className={styles.login}>
      {isLoading && <Loader/>}
      {modalActive && <Modal onCancelBtnAction={ () => {setModalActive(false)}}>
        <h3 className={styles['modal-header']}>Who are you?</h3>
        <div className={styles['roles']}>
          <Link to="/sign-up/?role=teacher" className={styles['role']}>
            <p>I'm a Teacher</p>
            <Arrow right white/>
          </Link>
          <Link to="/sign-up/?role=student" className={styles['role']}>
            <p>I'm a Student</p>
            <Arrow right white/>
          </Link>
        </div>
      </Modal>}
      <img className={styles['logo']} src={appLogo} alt="logo" />
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
          <p>Don't have an account? <b onClick={() => {setModalActive(true)}}>Create</b></p>
        </div>
      </form>
      <div className={styles['credits']}>
        <p>Powered by:</p>
        <img src={sistemasLogo} alt="logo" />
      </div>
    </div>
  );
};

export default Login;
