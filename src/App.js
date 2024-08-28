import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Signin from "./Pages/SignIn/Signin";
import Chat from "./Pages/Chat/Chat";
import Error from "./Pages/Error/Error";
import "rsuite/dist/rsuite.min.css";
import { ProfileProvider } from "./context/profile.context";
import { RoomsProvider } from "./context/rooms.context";
import Chatting from "./Pages/Chatting/Chatting";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <ProfileProvider>
          <RoomsProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<Error />} />
              <Route path="/chatting/:chatID" element={<Chatting />} />
            </Routes>
          </RoomsProvider>
        </ProfileProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
