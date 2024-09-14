import { ref, update, remove, push, set, onValue } from "firebase/database";
import { FaHeart, FaRegComment } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import React, { useState } from "react";
//import { usePosts } from "../../context/posts.context";
import "./ViewPosts.css";
import { useProfile } from "../../context/profile.context";
import { database } from "../../misc/firebase";
import { Button, Modal } from "rsuite";
import Chat from "../Chat/Chat";
import { MagnifyingGlass } from "react-loader-spinner";

const ViewPosts = ({ posts, loading }) => {
  const { profile } = useProfile();
  const [likes, setLikes] = useState(false);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState({});
  const [currentPostId, setCurrentPostId] = useState(null);

  console.log("posts in view posts", posts);

  const handleLike = (postId) => {
    setLikes(true);
    let postRef = ref(database, `posts/${postId}`);
    if (likes) {
      update(postRef, { likes: (posts[postId].likes || 0) + 1 }).then(() => {
        alert("liked the post");
      });
    }
  };

  const handleComment = (postId) => {
    setOpen(true);
    setCurrentPostId(postId);
    let postCommentsRef = ref(database, `posts/${postId}/comments`);
    console.log(postCommentsRef);
    onValue(postCommentsRef, (snapShot) => {
      if (snapShot.val()) {
        console.log("snapshot of comments", snapShot.val());
        setAllComments({ ...snapShot.val() });
      } else {
        setAllComments({});
      }
    });
  };

  const handleDelete = (postId) => {
    let postRef = ref(database, `posts/${postId}`);
    remove(postRef)
      .then(() => {
        alert("post deleted...!");
      })
      .catch((err) => console.log("error in  deleting post:", err));
  };

  const closeModal = () => {
    setOpen(false);
    setAllComments({});
    setCurrentPostId(null);
  };

  const postComment = () => {
    if (comment && currentPostId) {
      const postCommentsRef = push(
        ref(database, `posts/${currentPostId}/comments`)
      );
      set(postCommentsRef, {
        text: comment,
        timestamp: new Date().toLocaleString(),
        user: profile.name,
      }).then(() => {
        alert("comment posted...!");
        setComment("");
        // Refresh comments
        handleComment(currentPostId);
      });
    }
  };

  console.log("Objects keys of posts:", Object.keys(posts));

  console.log(posts);
  return (
    <div>
      <div className="displaying-posts">
        {posts && !loading ? (
          Object.entries(posts).map(([postID, post]) => (
            <div key={postID} className="posts-display">
              <div className="post-footer">
                <div>
                  <FaHeart onClick={() => handleLike(postID)} size={25} />{" "}
                  <span style={{ fontSize: "20px" }}>
                    {post.likes || 0} likes
                  </span>
                </div>
                <div
                  onClick={() => handleComment(postID)}
                  style={{ cursor: "pointer" }}
                >
                  <FaRegComment size={25} />{" "}
                  <span style={{ fontSize: "20px" }}>Comments</span>
                </div>
                {post.user === profile.name ? (
                  <div>
                    <MdDelete
                      color="red"
                      onClick={() => handleDelete(postID)}
                      size={25}
                    />{" "}
                    <span style={{ fontSize: "20px", color: "red" }}>
                      Delete
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
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
        ) : !posts && loading ? (
          <>
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              glassColor="#c0efff"
              color="#e15b64"
              wrapperClass="magnifying-glass"
              wrapperStyle={{}}
            />
          </>
        ) : (
          <>
            <Chat />
          </>
        )}
      </div>
      <Modal open={open} onClose={closeModal}>
        <Modal.Header>
          <span style={{ fontSize: "22px" }}>Comment:</span>
          <input
            type="text"
            placeholder="comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input-comment"
          />
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="all-comments">
            {Object.keys(allComments).length > 0 ? (
              Object.entries(allComments).map(([commentId, comment]) => (
                <div key={commentId} className="single-comment">
                  <span style={{ fontWeight: "600" }}>{comment.user}:</span>
                  {comment.text}
                  <p>{comment.timestamp}</p>
                </div>
              ))
            ) : (
              <div>
                <h3>No comments yet</h3>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" color="green" onClick={postComment}>
            Post comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewPosts;
