// Import Firebase modules via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGwnZIaQqAi87HR_tIzjpj1JBMaghV1zc",
  authDomain: "gymanotaciones.firebaseapp.com",
  projectId: "gymanotaciones",
  storageBucket: "gymanotaciones.firebasestorage.app",
  messagingSenderId: "778945656471",
  appId: "1:778945656471:web:5cb4c453e2034448cd5bd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
