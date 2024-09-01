import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Signin from "./Pages/SignIn/Signin";
import Error from "./Pages/Error/Error";
import "rsuite/dist/rsuite.min.css";
import { ProfileProvider } from "./context/profile.context";
import { RoomsProvider } from "./context/rooms.context";
import Chatting from "./Pages/Chatting/Chatting";
import Posts from "./Pages/Posts/Posts";
import { PostsProvider } from "./context/posts.context";
import ViewPosts from "./Pages/ViewPosts/ViewPosts";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <ProfileProvider>
          <RoomsProvider>
            <PostsProvider>
              <Routes>
                <Route path="/posts/viewposts" element={<ViewPosts />} />
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="*" element={<Error />} />
                <Route path="/chatting/:chatID" element={<Chatting />} />
              </Routes>
            </PostsProvider>
          </RoomsProvider>
        </ProfileProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
