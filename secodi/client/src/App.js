import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import Swal from 'sweetalert2'
import logo from './logo.png'
 
const socket = io.connect();

//const socket = io.connect('http://localhost:3002/');


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = () => {
    if(username.length > 11){
      Swal.fire({
        title: 'Wait!',
        text: 'Only maximum 10 characters.',
        imageUrl: logo,
        imageWidth: 280,
        imageHeight: 200,
        imageAlt: 'Secodi',
      })
      return;
    }
    if (username !== "" && room !== "") {
      socket.emit("join_room", room, username);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
           <img src={logo} className="logo-image"/>
          <h3 className="title">SecodiChat</h3>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
