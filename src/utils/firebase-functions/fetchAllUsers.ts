import { Firestore, where, query } from "firebase/firestore";
import { 
  getDocs, 
  collection,
} from "firebase/firestore"; 

export const fetchAllUsers = async (db: Firestore, setUsersState: Function) => {      
  const students = query(collection(db, "users"), where("role", "==", "student"));
  // const allUsers = collection(db, "users");
  getDocs(students)
    .then(querySnapshot => {
      querySnapshot.forEach((doc) => {
        const docData = doc.data(); 
        setUsersState(docData)
      });
    })
    .catch(error => {
      console.log(error, error.code, error.message)
    })
}