import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnAuthState } from '../../store/userAuth-slice';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import { Navigate, Route, Routes } from "react-router-dom";
// * Pages
import TestCompo from '../../pages/TestCompo/TestCompo';
import Login from '../../pages/Login/Login';
import Home from '../../pages/Home/Home';
import SignUp from '../../pages/SignUp/SignUp';
import PendingTeacher from '../../pages/PendingTeacher/PendingTeacher';
import ClassDetail from '../../pages/ClassDetail/ClassDetail';
import StudentDetail from '../StudentDetail/StudentDetail';
import CreateClass from '../../pages/CreateClass/CreateClass';
import StudentTopicsDetail from '../../pages/StudentTopicsDetail/StudentTopicsDetail';
import EditClass from '../../pages/EditClass/EditClass';


const  App = () => {
  const dispatch = useDispatch();  
  useEffect(() => {
    dispatch(setOnAuthState(auth, db));
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} ></Route>
        <Route path="/test" element={<TestCompo/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/sign-up" element={<SignUp/>} ></Route>
        <Route path="/user-detail/:userId" element={<StudentDetail/>}></Route>
        <Route path="/evaluate-student/:userId" element={<StudentTopicsDetail editing/>}></Route>
        <Route path="/student-topics-detail/:userId" element={<StudentTopicsDetail editing={false}/>}></Route>
        <Route path="/class-detail/:classId" element={<ClassDetail/>}></Route>
        <Route path="/teacher-pending" element={<PendingTeacher/>}></Route>
        <Route path="/create-class" element={<CreateClass/>}></Route>
        <Route path="/edit-class/:classId" element={<EditClass/>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
