import React, { useEffect, useState } from "react";
import { auth, database } from "../../misc/firebase";
import { useNavigate } from "react-router-dom";
import { Modal } from "rsuite";
import { ref, set } from "firebase/database";
import { useRooms } from "../../context/rooms.context";

const Chat = () => {
  const navigate = useNavigate();
  const [signedOut, setSignedOut] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [open, setOpen] = useState(false);
  const [roomsCount, setRoomsCount] = useState(0);
  const [rooms, setRooms] = useState([]);

  const allRooms = useRooms();

  const signingOut = () => {
    setSignedOut(true);
    auth.signOut();
  };

  const creatingRoom = () => {
    const roomsRef = ref(database, `rooms/${roomsCount}`);
    let allRooms = [...rooms];
    let room = {
      title: title,
      description: description,
    };
    set(roomsRef, room);
    setRoomsCount((r) => r + 1);
    setOpen(false);
    alert("Created new room");
    setTitle("");
    setdescription("");
    allRooms.push(room);
    setRooms(allRooms);
  };

  useEffect(() => {
    if (signedOut) {
      navigate("/");
    }
    setRooms(allRooms);
  }, [signedOut, navigate, allRooms]);

  return (
    <div>
      <div>
        <h1>Chat Page</h1>
      </div>
      <div>
        <button onClick={() => setOpen(true)}>Create Room</button>
        <Modal size="md" open={open} onClose={() => setOpen(false)}>
          <Modal.Header>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
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
        {rooms &&
          rooms.map((room, idx) => {
            return (
              <div key={idx}>
                <div>{room.title}</div>
              </div>
            );
          })}
      </div>
      <div>
        <button onClick={signingOut}>SignOut</button>
      </div>
    </div>
  );
};

export default Chat;
