const express= require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");


app.use(cors());

const server=http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    },
});

const user_list = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];

io.on("connection",(socket)=>{
    console.log(`user connected: ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
        console.log(`user with id: ${socket.id} joined room: ${data}`);
    })
     
    socket.on("send_message", (data)=>{
        
        const { room, author, message, time, likes } = data; 

        const chatdata = {
          room: room,
          author: author,
          message: message,
          time: time,
          likes: likes,
        };

        socket.to(data.room).emit("receive_message",chatdata);
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    });
});

server.listen(3001,()=>{
    console.log("server running");
});


