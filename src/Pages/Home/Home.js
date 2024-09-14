import React from "react";
import Signin from "../SignIn/Signin";
import { useProfile } from "../../context/profile.context";
//import { useNavigate } from "react-router-dom";
import "./Home.css";
import Chat from "../Chat/Chat";
import { Oval } from "react-loader-spinner";

const Home = () => {
  //const navigate = useNavigate();
  const { profile, loading } = useProfile();

  /*useEffect(() => {
    if (profile) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, [profile, navigate]);*/

  return (
    <>
      {profile ? (
        <Chat />
      ) : !profile && loading ? (
        <Oval
          visible={true}
          height="80"
          width="80"
          ariaLabel="oval-loading"
          color="#0da006"
          wrapperStyle={{}}
          wrapperClass="signin-loading"
        />
      ) : (
        <div className="home">
          <div className="floating">
            <h1>Group Chat Application</h1>
            <h4>A Progressive Web Application for chatting...</h4>
          </div>
          <Signin />
        </div>
      )}
    </>
  );
};

export default Home;
