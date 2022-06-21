import { Firestore } from "firebase/firestore";
import { 
  getDoc, 
  doc, 
} from "firebase/firestore"; 

export const getCurrentUser = async (uid: string, db: Firestore) => {
  const docSnap = await getDoc(doc(db, `users/${uid}`));
  return docSnap;
}