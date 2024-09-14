import React, { useEffect, useState } from "react";
import { auth, database } from "../../misc/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Modal, IconButton, Button } from "rsuite";
import { push, ref, set } from "firebase/database";
import { useRooms } from "../../context/rooms.context";
import "./Chat.css";
import { MdLogout } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import profileImg from "../../assets/profile.png";
import { useProfile } from "../../context/profile.context";
import { FidgetSpinner } from "react-loader-spinner";
import ChatIcon from "./ChatIcon";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";

const Chat = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [signedOut, setSignedOut] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const { allRooms, loading } = useRooms();
  console.log("allRooms:", allRooms);

  const signingOut = () => {
    navigate("/");
    setSignedOut(true);
    auth.signOut();
    alert("Signing out...");
  };

  const creatingRoom = () => {
    if (!title) {
      alert("Please provide title of the room...");
    }
    if (title && !description) {
      alert("please provide description of the room...");
    }
    if (title && description) {
      const roomRef = push(ref(database, "rooms"));
      let room = {
        title: title,
        description: description,
        id: roomRef.key,
      };
      set(roomRef, room)
        .then(() => {
          setOpen(false);
          alert("Created new room");
          setOpen(false);
          setTitle("");
          setdescription("");
        })
        .catch((err) => {
          alert("Failed to create new room");
          console.log("Error creating room:", err);
        });
    }
  };

  useEffect(() => {
    /*if (signedOut) {
      navigate("/");
    }*/
    setRooms(Object.values(allRooms));
  }, [allRooms]);

  return (
    <div className="chat">
      <div>
        <h2 className="typing1">Let's, chat in a group with others...</h2>
      </div>
      <div className="display">
        <div className="left-box">
          <div>
            {signedOut ? (
              <></>
            ) : (
              <img
                src={profile.image ? profile.image : profileImg}
                alt={profile.name}
                title={profile.name}
                className="profile-image"
              />
            )}
            <h4>{profile.name}</h4>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/posts"
            >
              <p className="posts">Posts</p>
            </Link>
          </div>
          <div className="links">
            <p style={{ backgroundColor: "gray" }}>Available Rooms</p>
            {rooms && !loading ? (
              rooms.map((room, idx) => {
                return (
                  <div key={idx} className="chat-links">
                    <Link to={`/chatting/${room.id}`}>{room.title}</Link>
                  </div>
                );
              })
            ) : (
              <>
                <FidgetSpinner
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="fidget-spinner-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
                <p style={{ color: "red" }}>Note: Rooms are loading...</p>
                <p style={{ color: "red" }}>Try refreshing the page</p>
                <p style={{ color: "red" }}>With good internet connection</p>
              </>
            )}
          </div>
          <div>
            <IconButton
              appearance="primary"
              color="blue"
              icon={<FaEdit />}
              onClick={() => setOpen(true)}
              className="create-room"
            >
              Create Room
            </IconButton>
            <Modal size="md" open={open} onClose={() => setOpen(false)}>
              <Modal.Header>
                Title
                <input
                  value={title}
                  placeholder="Title of the room..."
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "250px", height: "25px" }}
                />
              </Modal.Header>
              <Modal.Body>
                Description:
                <input
                  placeholder="information about the room..."
                  value={description}
                  style={{ width: "250px", height: "25px" }}
                  onChange={(e) => setdescription(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onClick={creatingRoom}
                  appearance="primary"
                  color="green"
                >
                  Ok
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

          <div>
            <IconButton
              appearance="primary"
              color="red"
              icon={<MdLogout />}
              onClick={signingOut}
              className="sign-out-btn"
            >
              SignOut
            </IconButton>
          </div>
        </div>
        <div className="right-box">
          <Canvas>
            <Stage environment="forest" intensity={1}>
              <ChatIcon />
            </Stage>
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Chat;
