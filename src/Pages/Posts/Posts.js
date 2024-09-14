import React, { useCallback, useEffect, useState } from "react";
import "./Posts.css";
import { FaPlusSquare } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../misc/firebase";
import { ref as dbRef, onValue, push, set } from "firebase/database";
import { Button, Modal } from "rsuite";
import { Link } from "react-router-dom";
import { database } from "../../misc/firebase";
import { useProfile } from "../../context/profile.context";
import ViewPosts from "../ViewPosts/ViewPosts";

const Posts = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = dbRef(database, "posts");
    onValue(
      postsRef,
      (snap) => {
        if (snap.val()) {
          setPosts(snap.val());
          setLoading(false);
        }
      },
      (err) => {
        console.log("Error in retrieving data", err.message);
        setLoading(false);
      }
    );
  }, []);

  const { profile } = useProfile();
  console.log("in posts:", profile);
  console.log("name in posts:", profile?.name);

  const fileChange = (e) => {
    let image1 = e.target.files[0];
    if (image1) {
      setIsUploading(true);
      const imageRef = ref(storage, `images/${image1.name}`);
      const uploadImg = uploadBytesResumable(imageRef, image1);
      uploadImg.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (err) => {
          console.log("error in Uploading image:", err.message);
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadImg.snapshot.ref)
            .then((url) => {
              setImageUrl(url);
              setIsUploading(false);
              setOpen(true);
            })
            .catch((err) => {
              console.log("URL error:", err);
              setIsUploading(false);
            });
        }
      );
    }
  };

  const closing = useCallback(() => {
    setOpen(false);
    setImageUrl("");
    setDescription("");
  }, []);

  const handlePost = useCallback(() => {
    if (imageUrl && profile.name) {
      const postRef = push(dbRef(database, "posts"));
      set(postRef, {
        imgurl: imageUrl,
        info: description,
        user: profile.name,
        timestamp: new Date().toLocaleString(),
      });
      closing();
      alert("Post uploaded successfully");
    } else {
      console.error("Image URL or profile name is not available");
    }
  }, [imageUrl, profile.name, description, closing]);

  return (
    <div>
      <div className="header">
        <div>
          <Link to="/" className="back-to-home-btn">
            Back to Chat rooms
          </Link>
        </div>
        <div>
          <h3 className="heading">View and create posts...</h3>
        </div>
      </div>
      <div>
        <label htmlFor="inputImage" className="create-post">
          <FaPlusSquare />
          Create Post
          <input
            id="inputImage"
            type="file"
            accept="image/*"
            onChange={fileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <Modal open={open} onClose={closing}>
        <Modal.Header>
          Description:
          <input
            type="text"
            value={description}
            placeholder="Description of the post..."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="modal-input"
          />
        </Modal.Header>
        <Modal.Body>
          {imageUrl ? (
            <img src={imageUrl} alt="uploading" style={{ maxWidth: "100%" }} />
          ) : (
            <p>Image is uploading... {uploadProgress.toFixed(2)}%</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="primary"
            color="blue"
            style={{ margin: "5px" }}
            onClick={handlePost}
            disabled={isUploading || !imageUrl}
          >
            Post
          </Button>
          <Button
            onClick={closing}
            appearance="primary"
            color="red"
            style={{ margin: "5px" }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="view-posts">
        <br />
        <ViewPosts posts={posts} loading={loading} />
      </div>
    </div>
  );
};

export default Posts;
