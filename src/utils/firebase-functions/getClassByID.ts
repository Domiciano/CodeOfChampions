import { Firestore } from "firebase/firestore";
import { 
  getDoc, 
  doc, 
} from "firebase/firestore"; 

export const getClassByID = async (classID: string, db: Firestore) => {
  // TODO: check if the current user exist on doc after a successful login, if not delete account from firebase auth
  const docSnap = await getDoc(doc(db, "classes", classID));
  return docSnap;
}