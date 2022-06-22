import React, { 
  useState, 
  useEffect, 
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  userAuthInitStateType, 
  logUserAsync, 
  setOnAuthState,
  addNewUserToFirestore
} from '../../store/userAuth-slice';
import { DocumentData } from "firebase/firestore"; 
import { UserType } from '../../types/user';
import { setUserDataFromObj } from '../../utils/firebase-functions/setUserDataFromObj';
import { fetchAllUsers } from '../../utils/firebase-functions/fetchAllUsers';
import { db, auth } from '../../utils/firebase-functions/getFirebaseInit';
import DummyTitle from '../DummyTitle';
import { Link } from "react-router-dom";


const  App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn); 
  console.log(isLoggedIn);
  // const currentUser = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.user); 
  const [usersData, setUserData] = useState<UserType[]>([]);
  const [isLOading, setIsLOading] = useState<boolean>(false);

  useEffect(() => {
    setIsLOading(true);
    setUserData([]);
    fetchAllUsers(db, (docData: DocumentData) => {
      setUserData(prev => {
        return [...prev, setUserDataFromObj(docData)]
      });
    })
      .then(() => setIsLOading(false));
    dispatch(setOnAuthState(auth, db));
  }, [dispatch]);

  // * Create user from Email and Password
  const onCreateNewUser = () => {
    const callback = () => {
      setUserData([])
      fetchAllUsers(db, (docData: DocumentData) => {
        setUserData(prev => {
          return [...prev, setUserDataFromObj(docData)]
        });
      });
    }
    const dummyUser: UserType = {
      first: "TryCatchStuff AAAAJJ",
      last: "Lovelace",
      born: 1815,
      id: ''
    }
    dispatch(addNewUserToFirestore(db, dummyUser, auth, callback, 'ty@mail.com', 'Ergo007/'))
  }
  // * Login User By Email and Password
  const handleLogin = () => {
    dispatch(logUserAsync(auth, db, 'daniel@mail.com', 'Ergo007/'));
  }
  return (
    <div className="App">
      <DummyTitle/>
      <Link to="/home">Home</Link>
      <button onClick={onCreateNewUser}>Click me to Auth</button>
      <button onClick={handleLogin}>Click me to login</button>
      {isLoggedIn && <p>There is a user bby</p>}
      {isLOading && <p>Loading</p>}
      <ul>
        <b>Users: {usersData.length}</b>
        {usersData.map(data => <li key={Math.random().toString()}>{data.first}</li>)}
      </ul>
    </div>
  );
}

export default App;
