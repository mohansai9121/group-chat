import React, { useEffect, useState } from "react";
import { auth, database } from "../../misc/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Modal, IconButton } from "rsuite";
import { push, ref, set } from "firebase/database";
import { useRooms } from "../../context/rooms.context";
import "./Chat.css";
import { MdLogout } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import profileImg from "../../assets/profile.png";
import { useProfile } from "../../context/profile.context";

const Chat = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [signedOut, setSignedOut] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const allRooms = useRooms();
  console.log("allRooms:", allRooms);

  const signingOut = () => {
    navigate("/");
    setSignedOut(true);
    auth.signOut();
    alert("Signing out...");
  };

  const creatingRoom = () => {
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
            <p className="posts">
              <Link style={{ textDecoration: "none" }} to="/posts">
                Posts
              </Link>
            </p>
          </div>
          <div className="links">
            <p style={{ backgroundColor: "gray" }}>Available Groups</p>
            {rooms &&
              rooms.map((room, idx) => {
                return (
                  <div key={idx} className="chat-links">
                    <Link to={`/chatting/${room.id}`}>{room.title}</Link>
                  </div>
                );
              })}
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
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Modal.Header>
              <Modal.Body>
                Description:
                <input
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <button onClick={creatingRoom}>Ok</button>
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
          <h2 style={{ marginTop: "200px" }} className="typing">
            Click on the chat groups to open chat..
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Chat;
