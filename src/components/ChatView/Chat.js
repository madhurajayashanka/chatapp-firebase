import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../../context/AuthContextProvide";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import "./Chat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function Chat() {
  const chatBoxRef = useRef(null);
  const auth = UserAuth().useAuth();
  const { chatRoom } = useParams();
  const [newMessage, setNewMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    const q = query(collection(db, chatRoom));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => a.createdAt - b.createdAt)
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUserDetails(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.reset();
    if (newMessage === "") {
      return;
    }
    try {
      const docRef = await addDoc(collection(db, chatRoom), {
        message: newMessage,
        createdAt: serverTimestamp(),
        uid: auth?.uid,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const scrollToBottom = () => {
    chatBoxRef.current.scrollTop =
      chatBoxRef.current.scrollHeight - chatBoxRef.current.clientHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatContainer bg-dark">
      <h2 className="chatRoomName">
        Welcome to {chatRoom.toUpperCase()}{" "}
        {auth?.displayName.slice(0, auth?.displayName.indexOf(" "))}
      </h2>
      <div className="chatBox" ref={chatBoxRef}>
        {messages.map((message, index) => {
          if (message.uid === auth?.uid) {
            return (
              <p className="userMessageContainer">
                <p className="userMessageInnerContainer">
                  <p key={index} className="userMessage">
                    {message.message}
                  </p>
                  {auth?.photoURL && (
                    <img
                      src={auth?.photoURL}
                      onError={(e) => {
                        e.target.src =
                          "https://w7.pngwing.com/pngs/754/2/png-transparent-samsung-galaxy-a8-a8-user-login-telephone-avatar-pawn-blue-angle-sphere-thumbnail.png"; // Replace with a valid fallback image URL
                      }}
                      className="userProfilePic"
                      alt="user profile pic"
                    />
                  )}
                </p>

                <p className="userMessagedTime">
                  {message.createdAt?.toDate().toLocaleTimeString()}
                </p>
              </p>
            );
          }

          if (message.uid !== auth?.uid) {
            const user = userDetails.find((user) => user.uid === message.uid);
            if (!user) {
              return null;
            }

            return (
              <div className="otherMessageContainer">
                <div className="otherMessageInnerContainer">
                  <img
                    src={user.photoUrl}
                    className="otherProfilePic"
                    alt="user profile pic"
                  />
                  <p className="otherMessage">{message.message}</p>
                </div>
                <div className="otherMessageMetaContainer">
                  <p className="otherMessageUserName">{user.userName}</p>
                  <p className="otherMessagedTime">
                    {message.createdAt?.toDate().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
      <form className="messageSendForm" onSubmit={handleSubmit}>
        <input
          className="inputMessage"
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          placeholder="Type your message"
        ></input>
        <button className="messageSendButton" type="submit">
          <FontAwesomeIcon className="icon" icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
}

export default Chat;
