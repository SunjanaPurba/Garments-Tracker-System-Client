// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// // Firebase web app configuration from environment variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // Validate that all required environment variables are present
// const validateFirebaseConfig = () => {
//   const requiredKeys = [
//     'VITE_FIREBASE_API_KEY',
//     'VITE_FIREBASE_AUTH_DOMAIN',
//     'VITE_FIREBASE_PROJECT_ID',
//     'VITE_FIREBASE_STORAGE_BUCKET',
//     'VITE_FIREBASE_MESSAGING_SENDER_ID',
//     'VITE_FIREBASE_APP_ID',
//     'VITE_FIREBASE_MEASUREMENT_ID'
//   ];

//   for (const key of requiredKeys) {
//     if (!import.meta.env[key]) {
//       console.error(`Missing Firebase environment variable: ${key}`);
//       return false;
//     }
//   }
//   return true;
// };

// // Only initialize Firebase if all environment variables are present
// let app;
// let auth;
// let analytics;

// if (validateFirebaseConfig()) {
//   try {
//     app = initializeApp(firebaseConfig);
//     auth = getAuth(app);
//     analytics = getAnalytics(app);
//     console.log("Firebase initialized successfully");
//   } catch (error) {
//     console.error("Error initializing Firebase:", error);
//   }
// } else {
//   console.error("Firebase configuration is incomplete");
// }

// export { auth, analytics };



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase web app configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required environment variables are present
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID'
  ];

  for (const key of requiredKeys) {
    if (!import.meta.env[key]) {
      console.error(`Missing Firebase environment variable: ${key}`);
      return false;
    }
  }
  return true;
};

// Only initialize Firebase if all environment variables are present
let app;
let auth;
let analytics;

if (validateFirebaseConfig()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.error("Firebase configuration is incomplete");
}

export { auth, analytics };