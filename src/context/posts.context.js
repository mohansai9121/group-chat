import { createContext, useState, useContext, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../misc/firebase";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  console.log("posts in posts context", posts);

  useEffect(() => {
    const postsRef = ref(database, "posts");
    console.log("postsRef in posts context:", postsRef);
    onValue(postsRef, (snapshot) => {
      console.log("snapshot in posts context:", snapshot);
      if (snapshot.val()) {
        const data = Object.values(snapshot.val());
        setPosts([...data]);
      }
    });
  }, []);

  return (
    <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
  );
};

export const usePosts = () => {
  return useContext(PostsContext);
};
