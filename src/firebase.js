// Importamos las funciones que necesitamos de los SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Reemplaza este objeto con TU propia configuración de Firebase (el que copiaste del paso 3)
const firebaseConfig = {
  apiKey: "AIzaSyAqhVO1rw85khHBXe4uU1NvO8-GTtywFyI",
  authDomain: "chocopiura.firebaseapp.com",
  projectId: "chocopiura",
  storageBucket: "chocopiura.firebasestorage.app",
  messagingSenderId: "6499281096",
  appId: "1:6499281096:web:e5f35b5072a76991931dfd"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos y exportamos la base de datos (Firestore) para usarla en otros archivos
export const db = getFirestore(app);
export const auth = getAuth(app);