import React from "react";
import { usePosts } from "../../context/posts.context";

const ViewPosts = () => {
  const { posts } = usePosts();

  console.log("posts in view posts", posts);

  console.log(posts);
  return (
    <div>
      <div>
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
            <h4
              style={{
                textAlign: "center",
                color: "red",
                backgroundColor: "yellow",
              }}
            >
              No posts available, ERROR in retrieving posts..working on it
            </h4>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPosts;
