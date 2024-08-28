import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase";
import { off, onValue, ref } from "firebase/database";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileRef;
    const authUnsubscribe = onAuthStateChanged(auth, (authObj) => {
      console.log("Auth change:");
      console.log(authObj);
      if (authObj) {
        profileRef = ref(database, `profiles/${authObj.uid}`);
        onValue(profileRef, (snap) => {
          console.log("snap value:", snap.val());
          if (snap.val()) {
            const { name, email, image } = snap.val();
            let user = {
              name: name,
              email: email,
              image: image,
            };
            setProfile(user);
            setLoading(false);
          }
        });
      } else {
        if (profileRef) {
          off(profileRef);
        }
        setProfile(null);
        setLoading(false);
      }
    });
    return () => {
      authUnsubscribe();
      if (profileRef) {
        off(profileRef);
      }
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
