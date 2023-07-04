import { useState } from 'react';
import './App.css';
import io from 'socket.io-client'
import Mychat from './Mychat';

const socket = io.connect("http://localhost:3001"); 

function App() {

const [name,setname]=useState("");
const [room,setRoom] = useState("");
const [showChat, setShowChat]=useState(false);

const joinRoom = ()=>{
  if(name!=="" && room!=="")
  {
   socket.emit("join_room",room); 
   setShowChat(true);
  }
}



  return (
    <div className="App">
      {!showChat ?(
      <div className='joinChatContainer'>
      <h2> Join My Chat</h2>
      <input type='text' placeholder='enter your name' onChange={(event)=>{
        setname(event.target.value);
      }}/>
      <input type='text' placeholder='enter room number' onChange={(event)=>{
        setRoom(event.target.value);
      }}/>
      <button onClick={joinRoom}>Start Chatting</button>
      </div>)
      :(
      <Mychat socket={socket} name={name} room={room}/>
       )}   
      </div>
  );
}

export default App;
