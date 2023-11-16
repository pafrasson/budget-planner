import BudgetTracker from "./BudgetTracker.js";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHP6Xy9Y4Q71w77ba3b13Od2IssaFEG3o",
    authDomain: "budget-planner-c8e63.firebaseapp.com",
    projectId: "budget-planner-c8e63",
    storageBucket: "budget-planner-c8e63.appspot.com",
    messagingSenderId: "217432681396",
    appId: "1:217432681396:web:e646ae18e0c73b0f0620e1"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

new BudgetTracker("#app");