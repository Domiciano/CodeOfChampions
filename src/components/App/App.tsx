import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAuthInitStateType, setOnAuthState } from '../../store/userAuth-slice';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import { Navigate, Route, Routes } from "react-router-dom";
// * Pages
import TestCompo from '../../pages/TestCompo/TestCompo';
import Login from '../../pages/Login/Login';
import Home from '../../pages/Home/Home';
import SignUp from '../../pages/SignUp/SignUp';
import PendingTeacher from '../../pages/PendingTeacher/PendingTeacher';
import StudentDetail from '../StudentDetail/StudentDetail';


const  App = () => {
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  
  useEffect(() => {
    dispatch(setOnAuthState(auth, db));
  }, [dispatch]);

  // * Create user from Email and Password
  // const onCreateNewUser = (user: string) => {
  //   const dummyUser: UserType = {
  //     first: user,
  //     last: "San",
  //     born: 2001,
  //     id: '',
  //     role: 'student'
  //   }
  //   dispatch(addNewUserToFirestore(db, dummyUser, auth, setAllUsersData, `${user}@mail.com`, 'Ergo007/'))
  //   .then()
  //   .catch(error => {
  //     console.log('SIP')
  //   })
  // }
  // * Login User By Email and Password
  // const handleLoginTeacher = () => {
  //   dispatch(logUserAsync(auth, db, 'ty@mail.com', 'Ergo007/', setAllUsersData));
  // }
  // const handleLoginStudent = () => {
  //   dispatch(logUserAsync(auth, db, 'student@mail.com', 'Ergo007/', setAllUsersData));
  // }
  // const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: any) => {
  //   e.preventDefault();
  //   console.log(e.target.user.value);
  //   onCreateNewUser(e.target.user.value);
  // }
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} ></Route>
        <Route path="/test" element={<TestCompo/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/sign-up" element={<SignUp/>} ></Route>
        <Route path="/user-detail/:userId" element={<StudentDetail/>}></Route>
        <Route path="/teacher-pending" element={<PendingTeacher/>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
