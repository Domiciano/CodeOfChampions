import React, {useEffect} from 'react'
import { auth, db } from '../utils/firebase-functions/getFirebaseInit';
import { userAuthInitStateType, logOutUser, setOnAuthState } from '../store/userAuth-slice';
import { useSelector, useDispatch } from 'react-redux';

const DummyTitle: React.FunctionComponent<{callback: Function}> = ({callback}) => {
  const currentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user);
  const dispatch = useDispatch();
  const handleSIgnOut = () => {
    dispatch(logOutUser(auth));
    callback();
  }
  useEffect(() => {
    dispatch(setOnAuthState(auth, db));
  }, [dispatch]);
  return (
    <div>
      {currentUser && <h2>{`${currentUser.name} | ${currentUser.id} | ${currentUser.email}`}</h2>}
      <button onClick={handleSIgnOut}>Click me to signOut</button>
    </div>
  )
}

export default DummyTitle