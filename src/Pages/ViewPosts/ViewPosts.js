import React, { useState, useEffect } from "react";
import { ref, onValue, off, onChildAdded } from "firebase/database";
import { database } from "../../misc/firebase";

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = ref(database, "posts");
    console.log("postsRef in view posts", postsRef);
    onValue(postsRef, (snapshot) => {
      console.log("snapshot in view posts", snapshot.val());
      if (snapshot.val()) {
        console.log("snapshot in view posts", snapshot.val());
        const data = Object.values(snapshot.val());
        setPosts([...data]);
      } else {
        console.log("No posts found");
      }
    });
    console.log("postsRef in view posts2", postsRef);
    onChildAdded(postsRef, (snapshot) => {
      console.log("snapshot in view posts", snapshot.val());
      const data = Object.values(snapshot.val());
      setPosts([...data]);
    });
    return () => {
      if (postsRef) {
        off(postsRef);
      }
    };
  }, []);

  console.log("posts in view posts", posts);

  console.log(posts);
  return (
    <div>
      {/*<div>
        {posts ? (
          posts.map((post) => (
            <div key={post.id}>
              <img src={post.imgurl} alt={post.info} />
              <p>{post.info}</p>
              <p>{post.user}</p>
            </div>
          ))
        ) : (
          <>
            <h2>No posts available</h2>
          </>
        )}
      </div>*/}
      <h2>Currently no posts available, will update soon...</h2>
    </div>
  );
};

export default ViewPosts;
