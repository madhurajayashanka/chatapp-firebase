import React, { useState } from "react";
import { UserAuth } from "../../context/AuthContextProvide";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Button } from "react-bootstrap";

function Home() {
  const navigate = useNavigate();
  const { useAuth, signOutWithGoogle } = UserAuth();
  const auth = useAuth();

  const logOut = async () => {
    signOutWithGoogle();
  };

  const [roomName, setRoomName] = useState("");

  const createRoom = async () => {
    try {
      const docRef = await addDoc(collection(db, "chatRooms"), {
        roomName: roomName,
        createdBy: auth?.displayName,
        email: auth?.email,
        uid: auth?.uid,
      });

      console.log("Document written with ID: ", docRef.id);

      navigate(`/chat/${roomName}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className="home bg-dark">
      {auth.photoURL && (
        <img
          className="profilePic"
          src={auth.photoURL}
          alt="user profile pic"
        />
      )}
      <h2 className="welcomeTitle">Welcome {auth?.displayName}</h2>
      <h4 className="roomName">{roomName}</h4>
      <input
        className="inputRoomName"
        onChange={(e) => {
          setRoomName(e.target.value);
        }}
      ></input>
      <Button variant="success" onClick={createRoom}>
        Enter Chat Room Name
      </Button>
      <br />
      <Button variant="danger" onClick={logOut}>
        Log Out
      </Button>
    </div>
  );
}

export default Home;
