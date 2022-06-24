import { DocumentData } from "firebase/firestore";

export const setUserDataFromObj = (docData: DocumentData) => {
  const {last, first, born, id, role} = docData; 
  return {last, first, born, id, role}
}