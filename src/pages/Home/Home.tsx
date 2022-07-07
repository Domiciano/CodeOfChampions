import React, { useEffect } from 'react';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import { isTeacherType, isStudentType  } from "../../types/user";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAuthInitStateType, logOutUser } from '../../store/userAuth-slice';
import { getTeacherClasses, getStudentClass } from '../../store/class-slice';
import TeacherView from '../TeacherView/TeacherView';
import StudentView from '../../pages/StudentView/StudentView';

const Home = () => {
  const loggedUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const isFetchingCurrentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isFetchingCurrentUser);
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(!isFetchingCurrentUser){
      console.log('AAA', isLoggedIn);
      // * At this moment, the fetch process is finished
      // TODO: Check if there is a user login
      if(!isLoggedIn){
        navigate("/login");
      }  
    }

    if(loggedUser?.role === 'teacher' && isTeacherType(loggedUser)){
      console.log('TEACHER', loggedUser.isVerified);
      if(!loggedUser.isVerified){
        dispatch(logOutUser(auth, () => {
          navigate("/teacher-pending");
        }))
      }else{
        dispatch(getTeacherClasses(db, loggedUser.id));
      }
    }else if(loggedUser?.role === 'student' && isStudentType(loggedUser)){
      dispatch(getStudentClass(db, loggedUser.belongedClassId));
    }
  }, [dispatch, isFetchingCurrentUser, isLoggedIn, loggedUser, navigate]);

  return (
    <div>
      {(loggedUser?.role === 'teacher' && isTeacherType(loggedUser)) && 
        <TeacherView teacherUser={loggedUser}/>
      }
      {(loggedUser?.role === 'student' && isStudentType(loggedUser)) &&
        <StudentView studentUser={loggedUser}/>
      }
    </div>
  )
}

export default Home