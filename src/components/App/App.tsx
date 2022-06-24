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
  const [usersData, setUserData] = useState<UserType[]>([]);
  const [isLOading, setIsLOading] = useState<boolean>(false);

  const setAllUsersData = () => {
    setIsLOading(true);
    setUserData([]);
    fetchAllUsers(db, (docData: DocumentData) => {
      setUserData(prev => {
        return [...prev, setUserDataFromObj(docData)]
      });
    })
      .then(() => setIsLOading(false))
      .catch(error => {
        console.log('Error:', error.code, error.message);
      })
  }

  useEffect(() => {
    setAllUsersData();
    dispatch(setOnAuthState(auth, db));
  }, [dispatch]);

  // * Create user from Email and Password
  const onCreateNewUser = (user: string) => {
    const dummyUser: UserType = {
      first: user,
      last: "San",
      born: 2001,
      id: '',
      role: 'student'
    }
    dispatch(addNewUserToFirestore(db, dummyUser, auth, setAllUsersData, `${user}@mail.com`, 'Ergo007/'))
    .then()
    .catch(error => {
      console.log('SIP')
    })
  }
  // * Login User By Email and Password
  const handleLoginTeacher = () => {
    dispatch(logUserAsync(auth, db, 'ty@mail.com', 'Ergo007/', setAllUsersData));
  }
  const handleLoginStudent = () => {
    dispatch(logUserAsync(auth, db, 'student@mail.com', 'Ergo007/', setAllUsersData));
  }
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: any) => {
    e.preventDefault();
    console.log(e.target.user.value);
    onCreateNewUser(e.target.user.value);
  }
  return (
    <div className="App">
      <DummyTitle callback={setAllUsersData}/>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user" />
        <button>Click me to Auth</button>
      </form>
      <button onClick={handleLoginTeacher}>Click me to login as Teacher</button>
      <button onClick={handleLoginStudent}>Click me to login as Student</button>
      {isLoggedIn && <p>There is a user bby</p>}
      {isLOading && <p>Loading</p>}
      <ul>
        <b>Users (students): {usersData.length}</b>
        {usersData.map(data => <li key={Math.random().toString()}><Link to={`/user-detail/${data.id}`}>{data.first}</Link></li>)}
      </ul>
    </div>
  );
}

export default App;
