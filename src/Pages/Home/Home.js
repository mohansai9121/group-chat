import React, { useEffect } from "react";
import Signin from "../SignIn/Signin";
import { useProfile } from "../../context/profile.context";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  //const [isProfile, setIsProfile] = useState(profile);
  console.log("profile in Home:", profile);

  useEffect(() => {
    if (profile) {
      navigate("/chat");
    }
  }, [profile, navigate]);

  return (
    <div>
      <div>
        <h1>Group Chat Application</h1>
        <h4>A Progressive Web Application for chatting...</h4>
        <Signin />
      </div>
    </div>
  );
};

export default Home;
