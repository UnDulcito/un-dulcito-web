// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQVcJ5fveG-RlturXp16ODFSVLWMqgAM0",
  authDomain: "un-dulcito-web.firebaseapp.com",
  projectId: "un-dulcito-web",
  storageBucket: "un-dulcito-web.firebasestorage.app",
  messagingSenderId: "597753980792",
  appId: "1:597753980792:web:a1247034a5b90165ee0a8d"
};

// Inicializamos Firebase (con protección para que no se reinicie en Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportamos las herramientas listas para usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);