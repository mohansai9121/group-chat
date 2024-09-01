import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useProfile } from "../../context/profile.context";
import { push, ref, set, onValue } from "firebase/database";
import { database } from "../../misc/firebase";
import "./Chatting.css";
import { IconButton } from "rsuite";
import { IoSend } from "react-icons/io5";

const Chatting = () => {
  const { chatID } = useParams();
  const { profile } = useProfile();
  console.log(chatID);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");

  const sendMessage = () => {
    console.log(message);
    if (!message) {
      alert("please enter some message...");
    }
    if (message) {
      const messagesRef = push(ref(database, `rooms/${chatID}/messages`));
      set(messagesRef, {
        text: message,
        timestamp: Date.now(),
        user: profile.name,
      })
        .then(() => {
          setMessage("");
          console.log("Message sent");
          alert("Message sent successfully...");
        })
        .catch((err) => {
          console.log(err);
          alert("Error sending message..!");
        });
    }
  };

  useEffect(() => {
    const messagesRef = ref(database, `rooms/${chatID}/messages`);

    onValue(messagesRef, (snapshot) => {
      if (snapshot.val()) {
        console.log("messages:", snapshot.val());
        setMessages([...Object.values(snapshot.val())]);
      }
    });

    const roomRef = ref(database, `rooms/${chatID}`);
    onValue(roomRef, (snap) => {
      if (snap.val()) {
        console.log("room name:", snap.val().title);
        setRoomName(snap.val().title);
        setRoomDescription(snap.val().description);
      }
    });
  }, [chatID]);

  return (
    <div>
      <div className="heading">
        <Link to="/">
          <button className="go-back-btn">Go Back to Rooms</button>
        </Link>
        <div>
          <p style={{ textDecoration: "underline" }}>Room Name:</p>
          <h1 className="zoom-left">{roomName}</h1>
          <span>
            {roomDescription ? roomDescription : "No information provided"}
          </span>
        </div>
      </div>
      <div className="chat-area">
        <div className="input-msg">
          <input
            type="text"
            value={message}
            placeholder="Enter message here..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton
            onClick={sendMessage}
            icon={<IoSend />}
            appearance="primary"
            color="green"
          >
            Send
          </IconButton>
        </div>
        <div className="all-messages">
          {messages &&
            messages.map((message) => (
              <div key={message.timestamp} className="messages-display">
                <span
                  style={{
                    textDecoration: "underline",
                    width: "100px",
                    overflow: "hidden",
                  }}
                >
                  {message.user.split(" ")[0]}
                </span>
                :<p className="text">{message.text}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Chatting;
