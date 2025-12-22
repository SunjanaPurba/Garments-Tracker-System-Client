// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   GoogleAuthProvider,
//   signInWithPopup,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
// import { auth } from "../firebase.config";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const googleProvider = new GoogleAuthProvider();
//   const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

//   // Firebase auth functions
//   const register = (email, password) =>
//     createUserWithEmailAndPassword(auth, email, password);

//   const login = (email, password) =>
//     signInWithEmailAndPassword(auth, email, password);

//   const googleLogin = () => signInWithPopup(auth, googleProvider);

//   const logout = async () => {
//     await signOut(auth);
//     setUser(null);
//     localStorage.removeItem("access-token");
//   };

//   // Axios global config
//   axios.defaults.withCredentials = true;

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setLoading(true);

//       if (currentUser?.email) {
//         try {
//           // Get JWT from backend
//           const jwtRes = await axios.post(`${API_URL}/jwt`, {
//             email: currentUser.email,
//           });

//           const token = jwtRes.data.token;
//           if (!token) throw new Error("No token returned from server");

//           localStorage.setItem("access-token", token);

//           // Fetch full user data
//           const userRes = await axios.get(`${API_URL}/users/me`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           setUser(userRes.data);
//         } catch (err) {
//           console.error(
//             "Auth state error:",
//             err.response?.data?.message || err.message
//           );
//           setUser(null);
//           localStorage.removeItem("access-token");
//         }
//       } else {
//         setUser(null);
//         localStorage.removeItem("access-token");
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [API_URL]);

//   const authInfo = {
//     user,
//     loading,
//     register,
//     login,
//     googleLogin,
//     logout,
//     setUser,
//   };

//   return (
//     <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase.config";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  const API_URL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_REACT_APP_SERVER_URL;

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("access-token");
  };

  // Set default credentials
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.email) {
        try {
          // Attempt to get JWT - gracefully handle 404 or any error
          const jwtRes = await axios.post(
            `${API_URL}/jwt`,
            { email: currentUser.email },
            { timeout: 8000 }
          ).catch((err) => {
            if (err.response?.status === 404) {
              console.warn("JWT endpoint not found (404) - continuing as guest or public mode");
              return { data: { token: null } };
            }
            throw err;
          });

          const token = jwtRes.data?.token;

          if (token) {
            localStorage.setItem("access-token", token);

            // Fetch full user profile if token exists
            const userRes = await axios.get(`${API_URL}/users/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setUser(userRes.data);
          } else {
            // No token needed or backend doesn't use JWT → just use Firebase user
            setUser({
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
            });
          }
        } catch (err) {
          console.error("Auth error:", err.response?.data?.message || err.message);
          // On any auth-related error, fall back to minimal user info
          setUser({
            email: currentUser.email,
            displayName: currentUser.displayName || "User",
            photoURL: currentUser.photoURL,
            uid: currentUser.uid,
          });
          localStorage.removeItem("access-token");
        }
      } else {
        setUser(null);
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [API_URL]);

  const authInfo = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);