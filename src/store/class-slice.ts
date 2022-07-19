import { createSlice, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { getCurrentUser } from '../utils/firebase-functions/getCurrentUser';
import { 
  updateDoc,
  doc,
  Firestore,
  addDoc,
  collection,
  getDocs,
  where,
  query,
  arrayUnion, 
  getDoc
} from "firebase/firestore";
import { ClassType, SelectClassType, TopicDataType } from '../types/classes';




export type InitialStateType = {
  userClasses: ClassType[],
  classesToSelect: SelectClassType[]
};

const initialState: InitialStateType = {
  userClasses: [],
  classesToSelect: []
}

const classSlice = createSlice({
  name: "classSlice",
  initialState,
  reducers: {
    fetchClasses(state, action) {
      state.userClasses = action.payload.classes;
    },
    fetchClassesToSelect(state, action) {
      state.classesToSelect = action.payload.classes;
    },
    clearData(state) {
      state.userClasses = [];
    }
  },
});

export const addNewClass = (db: Firestore, currentClass:ClassType, callback?: Function) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    addDoc(collection(db, "classes"), currentClass)
      .then((data) => {
        updateDoc(doc(db, `classes/${data.id}`), {classId: data.id})
          .then(() => {
            console.log("Class has been created");
            // ! I do not know wether this is right
            dispatch(getActiveClasses(db));
            if(callback) callback();
          })
        updateDoc(doc(db, "users", currentClass.teacherId), {
          classesId: arrayUnion(data.id)
        })
          .then(() => {
            console.log("congrats")
          })
      })
  };
};

export const getTeacherClasses = (db: Firestore, userId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const teacherClasses = query(collection(db, "classes"), where("teacherId", "==", userId));
    const querySnapshot = await  getDocs(teacherClasses);
    let currentClasses: ClassType[] = [];
    querySnapshot.forEach((doc) => {
      const {term, schedule, profiles, topics, teacherId, classId, isActive, studentsId} = doc.data();
      currentClasses.push({ term, schedule, profiles, topics, teacherId, classId, isActive, studentsId: studentsId || []});
    });
    dispatch(classSlice.actions.fetchClasses({classes: currentClasses}))
  }
}

export const getStudentClass = (db: Firestore, classId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const docSnap = await getDoc(doc(db, "classes", classId));
    dispatch(classSlice.actions.fetchClasses({classes: [docSnap.data()]}))
  }
}

export const getActiveClasses = (db: Firestore ) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const activeClasses = query(collection(db, "classes"), where("isActive", "==", true));
    const querySnapshot = await  getDocs(activeClasses);
    let currentClasses: any = [];
    querySnapshot.forEach((doc) => {
      const {term, schedule, profiles, topics, teacherId, classId, isActive, studentsId} = doc.data();
      let currentClass = {
        term,
        schedule,
        profiles,
        topics,
        teacherId,
        classId,
        isActive,
        teacherName: getCurrentUser(teacherId, db),
        studentsId: studentsId || [],
      }
      currentClasses.push(currentClass);
    });
    const names = await Promise.all(currentClasses.map((p: any) => p.teacherName));
    names.forEach((n, index) => {
      currentClasses[index].teacherName = n.data().name;
    })
    dispatch(classSlice.actions.fetchClassesToSelect({classes: currentClasses}));
  }
}




export default classSlice;