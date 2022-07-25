import { createSlice, Dispatch, AnyAction } from "@reduxjs/toolkit";
import { getCurrentUser } from "../utils/firebase-functions/getCurrentUser";
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
  getDoc,
} from "firebase/firestore";
import {
  ActivityPodium,
  ActivityState,
  ClassType,
  SelectClassType,
  TopicDataType,
} from "../types/classes";
import { setUserDataFromObj } from "../utils/firebase-functions/setUserDataFromObj";
import { isStudentType } from "../types/user";
import data from "../data/profiles.json";
import { updateStudentAsync } from "./userAuth-slice";

export type InitialStateType = {
  userClasses: ClassType[];
  classesToSelect: SelectClassType[];
};

const initialState: InitialStateType = {
  userClasses: [],
  classesToSelect: [],
};

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
    },
  },
});

export const addNewClass = (
  db: Firestore,
  currentClass: ClassType,
  callback?: Function
) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    addDoc(collection(db, "classes"), currentClass).then((data) => {
      updateDoc(doc(db, `classes/${data.id}`), { classId: data.id }).then(
        () => {
          console.log("Class has been created");
          dispatch(getActiveClasses(db));
          if (callback) callback();
        }
      );
      updateDoc(doc(db, "users", currentClass.teacherId), {
        classesId: arrayUnion(data.id),
      }).then(() => {
        console.log("congrats");
      });
    });
  };
};

export const getTeacherClasses = (db: Firestore, userId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const teacherClasses = query(
      collection(db, "classes"),
      where("teacherId", "==", userId)
    );
    const querySnapshot = await getDocs(teacherClasses);
    let currentClasses: ClassType[] = [];
    querySnapshot.forEach((doc) => {
      const {
        term,
        schedule,
        profiles,
        topics,
        teacherId,
        classId,
        isActive,
        studentsId,
      } = doc.data();
      currentClasses.push({
        term,
        schedule,
        profiles,
        topics,
        teacherId,
        classId,
        isActive,
        studentsId: studentsId || [],
      });
    });
    dispatch(classSlice.actions.fetchClasses({ classes: currentClasses }));
  };
};

export const getStudentClass = (db: Firestore, classId: string) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const docSnap = await getDoc(doc(db, "classes", classId));
    dispatch(classSlice.actions.fetchClasses({ classes: [docSnap.data()] }));
  };
};

export const getActiveClasses = (db: Firestore) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const activeClasses = query(
      collection(db, "classes"),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(activeClasses);
    let currentClasses: any = [];
    querySnapshot.forEach((doc) => {
      const {
        term,
        schedule,
        profiles,
        topics,
        teacherId,
        classId,
        isActive,
        studentsId,
      } = doc.data();
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
      };
      currentClasses.push(currentClass);
    });
    const names = await Promise.all(
      currentClasses.map((p: any) => p.teacherName)
    );
    names.forEach((n, index) => {
      currentClasses[index].teacherName = n.data().name;
    });
    dispatch(
      classSlice.actions.fetchClassesToSelect({ classes: currentClasses })
    );
  };
};

export const updateClassTopics = (
  db: Firestore,
  teacherId: string,
  classProfiles: string[],
  classId: string,
  updatedTopics: TopicDataType[],
  callback: Function
) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    const topicsFromProfiles = classProfiles.map((cp) => ({
      name: cp,
      topics: updatedTopics.map((ut) => ({
        topicName: ut.name,
        activities: ut.activities.find((uta) => uta.profile === cp)
          ?.profileActivities,
      })),
    }));

    updateDoc(doc(db, `classes/${classId}`), {
      topics: updatedTopics,
    });
    dispatch(getTeacherClasses(db, teacherId));
    classProfiles.forEach((profile) => {
      const activeClasses = query(
        collection(db, "users"),
        where("belongedClassId", "==", classId),
        where("profile", "==", { name: profile })
      );
      getDocs(activeClasses).then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          const currentUserData = document.data();
          const currentUser = setUserDataFromObj(currentUserData);
          if (isStudentType(currentUser)) {
            let newClassState: {
              points: number;
              topics: {
                name: string;
                topicPoints: number;
                topicActivities: {
                  id: string;
                  state: ActivityState;
                  activityPodium?: ActivityPodium;
                }[];
              }[];
            } = {
              points: 0,
              topics: [],
            };
            currentUser.classState.topics.forEach((userTopics, topicsIndex) => {
              const currentTopicFromProfile = topicsFromProfiles
                .find((cp) => cp.name === profile)
                ?.topics.find(
                  (t) => t.topicName === userTopics.name
                )?.activities;
              if (!currentTopicFromProfile) return;
              let activitiesCopy = [...userTopics.topicActivities];
              activitiesCopy = activitiesCopy.filter((ac) =>
                currentTopicFromProfile.some((ct) => ac.id === ct.activityId)
              );
              const newActivities: {
                id: string;
                state: ActivityState;
                comments: string[];
              }[] = currentTopicFromProfile
                .filter((ac) =>
                  activitiesCopy.every((ct) => ac.activityId !== ct.id)
                )
                .map((ct) => ({
                  id: ct.activityId,
                  state: "none",
                  comments: [],
                }));
              activitiesCopy = [...activitiesCopy, ...newActivities];
              const newTopicPoints = activitiesCopy.reduce(
                (previousValueActivity, currentValueActivity) => {
                  return (
                    previousValueActivity +
                    (data.activityStateOPtions.find(
                      (d) => d.name === currentValueActivity.state
                    )?.value || 0)
                  );
                },
                0
              );
              newClassState.topics.push({
                name: userTopics.name,
                topicPoints: newTopicPoints,
                topicActivities: activitiesCopy,
              });
            });
            const newUserPoints = newClassState.topics.reduce(
              (previousTopicPoints, currentTopicPoints) => {
                return previousTopicPoints + currentTopicPoints.topicPoints;
              },
              0
            );
            newClassState.points = newUserPoints;
            //* UPDATING ALL THE USERS
            updateDoc(doc(db, `users/${document.data().id}`), {
              classState: newClassState,
            });
          }
        });
        callback();
      });
    });
  };
};

export const pairingApprenicesenpai = (
  db: Firestore,
  senpai: string,
  apprenticesId: string[],
  callback: Function
) => {
  return async (dispatch: Dispatch<AnyAction>) => {
    updateDoc(doc(db, `users/${senpai}`), {
      studentsId: arrayUnion(...apprenticesId),
    })
      .then(() => {
        dispatch(updateStudentAsync(db, senpai));
        if (callback) callback();
      })
      .catch((e) => {
        console.log(e, "PAIRING ERROR");
      });
    apprenticesId.forEach((a) => {
      updateDoc(doc(db, `users/${a}`), { senpaiId: senpai });
    });
  };
};

export default classSlice;
