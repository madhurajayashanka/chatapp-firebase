import { createContext, useContext } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider, db } from "../firebase-config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState();
  const navigate = useNavigate();

  const createUser = async (user) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        userName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoUrl: user.photoURL,
      });

      console.log("User written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const signInWithGoogle = async () => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserProfile(user);
          console.log("User is already signed in:", user);

          return userProfile;
        } else {
          signInWithPopup(auth, provider).then((result) => {
            setUserProfile(result.user);
            createUser(result.user);
            navigate("/home");
          });
        }
      });
    } catch (error) {
      return error;
    }
  };

  const useAuth = () => {
    onAuthStateChanged(auth, (user) => setUserProfile(user));
    return userProfile;
  };

  const signOutWithGoogle = async () => {
    signOut(auth)
      .then(() => {
        console.log("sign out");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <UserContext.Provider
      value={{ signInWithGoogle, useAuth, signOutWithGoogle }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
