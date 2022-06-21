import React from 'react'
import { auth } from '../utils/firebase-functions/getFirebaseInit';
import { userAuthInitStateType, logOutUser } from '../store/userAuth-slice';
import { useSelector, useDispatch } from 'react-redux';

const DummyTitle = () => {
  const currentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user); 
  const dispatch = useDispatch();
  const handleSIgnOut = () => {
    dispatch(logOutUser(auth));
  }
  return (
    <div>
      {currentUser && <h2>{currentUser.first}</h2>}
      <button onClick={handleSIgnOut}>Click me to signOut</button>
    </div>
  )
}

export default DummyTitle