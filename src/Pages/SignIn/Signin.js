import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, database } from "../../misc/firebase";
import { ref, set } from "firebase/database";

const Signin = () => {
  const googleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      if (response) {
        console.log("SignIn page:", response.user);
        const profileRef = ref(database, `profiles/${response.user.uid}`);
        set(profileRef, {
          name: response.user.displayName,
          email: response.user.email,
          createdAt: response.user.metadata.creationTime,
          recentLogin: response.user.metadata.lastSignInTime,
          image: response.user.photoURL,
        });
        alert("Logged in, Added to Database");
      }
    } catch (err) {
      console.log("Error in Signing in:", err.message);
    }
  };

  return (
    <div>
      <div>
        <button onClick={googleSignIn}>SignIn with Google</button>
      </div>
    </div>
  );
};

export default Signin;
