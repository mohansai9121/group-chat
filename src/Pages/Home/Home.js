import React, { useEffect } from "react";
import Signin from "../SignIn/Signin";
import { useProfile } from "../../context/profile.context";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    if (profile) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [profile, navigate]);

  return (
    <div className="home">
      <div className="floating">
        <h1>Group Chat Application</h1>
        <h4>A Progressive Web Application for chatting...</h4>
      </div>
      <Signin />
    </div>
  );
};

export default Home;
