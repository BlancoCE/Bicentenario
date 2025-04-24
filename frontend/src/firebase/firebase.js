// Importaciones básicas
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Configuración (usa tus propias credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyA375kiA-pMo0PeI16KPKPHgyHDH8bqGiA",
  authDomain: "bicentenario-5cc01.firebaseapp.com",
  projectId: "bicentenario-5cc01",
  storageBucket: "bicentenario-5cc01.appspot.com", // ¡Corregido! (usa .appspot.com)
  messagingSenderId: "761765259800",
  appId: "1:761765259800:web:779129ee378e8e2a29316d",
  measurementId: "G-WZYFD2RSRF"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Inicializa Storage

// Exporta lo que necesites
export { app, storage, analytics };