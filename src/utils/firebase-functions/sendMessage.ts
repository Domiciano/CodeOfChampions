import { updateDoc, doc, Firestore, arrayUnion } from "firebase/firestore";
import { userMessage } from '../../types/user';

export const sendMessage = (db: Firestore, userId: string, message: userMessage) => {
  updateDoc(doc(db, `users/${userId}`), {messages: arrayUnion(message)})
    .then(() => {
      console.log("MESSAGE SENDED")
    })
    .catch(e => {
      console.log(e, "MESSAGE ERROR")
    })
};