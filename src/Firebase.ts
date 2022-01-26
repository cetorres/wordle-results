// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  updateDoc,
  collection,
  where,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { clearLocaStorage } from "./Util";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZ0q6p_X42o9Ir31ofIVMNHEZ5Au2op8I",
  authDomain: "wordle-results.firebaseapp.com",
  projectId: "wordle-results",
  storageBucket: "wordle-results.appspot.com",
  messagingSenderId: "620904499399",
  appId: "1:620904499399:web:aded287c05c978340456e2",
  measurementId: "G-KWMKRR82WS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAnalytics = getAnalytics(firebaseApp);
const firestoreDb = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google account
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(firebaseAuth, googleProvider);
    const user = res.user;
    const q = query(collection(firestoreDb, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(firestoreDb, "users"), {
        uid: user.uid,
        name: user.displayName,
        auth_provider: "Google",
        email: user.email,
        updated_at: Timestamp.fromDate(new Date()),
        created_at: Timestamp.fromDate(new Date())
      });
    }
    else {
      const docData = { updated_at: Timestamp.fromDate(new Date()) };
      await updateDoc(docs.docs[0].ref, docData);
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Sign out
const logout = () => {
  signOut(firebaseAuth);
};

const loadResultsForCurrentUser = async () => {
  try {
    const user = firebaseAuth.currentUser;
    if (user) {
      const resultsQuery = query(collection(firestoreDb, "results"), where("uid", "==", user.uid));
      const docs = await getDocs(resultsQuery);
      if (docs.docs.length >= 0) {
        return docs.docs[0].get('results');
      }
    }
    return null;
  }
  catch (err: any) {
    console.log('Error on loading results. ' + err.message);
    return null;
  }
};

const saveResultsToCurrentUser = async (results: any) => {
  try {
    const user = firebaseAuth.currentUser;
    if (user) {
      const resultsQuery = query(collection(firestoreDb, "results"), where("uid", "==", user.uid));
      const docs = await getDocs(resultsQuery);
      if (docs.docs.length === 0) {
        await addDoc(collection(firestoreDb, "results"), {
          uid: user.uid,
          results: results,
          updated_at: Timestamp.fromDate(new Date()),
          created_at: Timestamp.fromDate(new Date())
        });
      }
      else {
        const docData = { results: results, updated_at: Timestamp.fromDate(new Date()) };
        await updateDoc(docs.docs[0].ref, docData);
      }
      return true;
    }
    return false;
  }
  catch (err: any) {
    console.log('Error on saving results. ' + err.message);
    return false;
  }
};

export {
  firebaseApp,
  firebaseAnalytics,
  firebaseAuth,
  firestoreDb,
  signInWithGoogle,
  logout,
  saveResultsToCurrentUser,
  loadResultsForCurrentUser
};