import { Firestore } from "firebase/firestore";
import { 
  getDocs, 
  collection,
} from "firebase/firestore"; 

export const fetchAllUsers = async (db: Firestore, setUsersState: Function) => {      
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const docData = doc.data(); 
    setUsersState(docData)
  });
}