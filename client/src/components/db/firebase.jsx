import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXgOB3Dfuf3AwOPvoUWL7ChoHfs6AYZm8",
  authDomain: "ioitive.firebaseapp.com",
  projectId: "ioitive",
  storageBucket: "ioitive.firebasestorage.app",
  messagingSenderId: "110203531010",
  appId: "1:110203531010:web:73ec3975225212009d5c1b",
  measurementId: "G-QSTKHMSF4R",
  databaseURL: "https://ioitive-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Export authentication
export const auth = getAuth(app);

// Export Firestore
export const db = getFirestore(app);
