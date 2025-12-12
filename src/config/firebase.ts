import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import process from "process";

const firebaseConfig = {
  apiKey: "AIzaSyAwSCEqSFkoGorcC6F4hKlGqNPaoaZduFw",
  authDomain: "hcm-project-ee2db.firebaseapp.com",
  projectId: "hcm-project-ee2db",
  storageBucket: "hcm-project-ee2db.firebasestorage.app",
  messagingSenderId: "5900199999",
  appId: "1:5900199999:web:2849a82b75f7d8c29ff08a",
  measurementId: "G-EN5PPL5WYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();