import React from "react";
import { usePosts } from "../../context/posts.context";
import "./ViewPosts.css";

const ViewPosts = () => {
  const { posts } = usePosts();

  console.log("posts in view posts", posts);
  console.log(Object.keys(posts));

  console.log(posts);
  return (
    <div>
      <div className="displaying-posts">
        {posts ? (
          Object.values(posts).map((post) => (
            <div key={post.id} className="posts-display">
              <img
                src={post.imgurl}
                alt={post.info ? post.info : "No description..."}
                className="postImage"
              />
              <h5>{post.info ? post.info : "no description"}</h5>
              <span>Posted on:{post.timestamp}</span>
              <p>
                Posted by:
                <span style={{ fontWeight: "500" }}>
                  {post.user ? post.user : "---"}
                </span>{" "}
              </p>
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
