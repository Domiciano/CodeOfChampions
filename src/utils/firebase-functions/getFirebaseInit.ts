import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { REACT_FIREBASE_API_KEY } from '../../utils/config';

const app = initializeApp(REACT_FIREBASE_API_KEY);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  db,
  auth
}