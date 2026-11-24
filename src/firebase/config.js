
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";

import {
  getAuth,
  connectAuthEmulator
} from "firebase/auth";

import {
  getStorage,
  connectStorageEmulator
} from "firebase/storage";

// Configuración de Firebase - EJERCICIO 3
const firebaseConfig = {
  apiKey: "AIzaSyCf9Afk5Chasg2lE0hXtTxAUIm5XmHysyA",
  authDomain: "vanessa-riffo-ejercicio-3.firebaseapp.com",
  projectId: "vanessa-riffo-ejercicio-3",
  storageBucket: "vanessa-riffo-ejercicio-3.firebasestorage.app",
  messagingSenderId: "678449661025",
  appId: "1:678449661025:web:f8e201f350d54eade1d620"
};

// Dirección IP del computador en la red Wi-Fi
const EMULATOR_HOST = window.location.protocol === "https:"
  ? "10.0.2.2"
  : "192.168.1.7";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Conectar Authentication al emulador
connectAuthEmulator(
  auth,
  `http://${EMULATOR_HOST}:9099`,
  { disableWarnings: true }
);

// Conectar Firestore al emulador
connectFirestoreEmulator(
  db,
  EMULATOR_HOST,
  8080
);

// Conectar Storage al emulador
connectStorageEmulator(
  storage,
  EMULATOR_HOST,
  9199
);
