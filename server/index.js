const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
require('dotenv').config();
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","https://collaber.netlify.app/"],
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    socket.to(data.room).emit("back", "Hello")
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  
  socket.on('canvas-data', (data) => {
    socket.broadcast.emit('canvas-data', data);

  });
});

app.get('/',(req,res)=>{
  res.send('testing')
})

server.listen(process.env.PORT ||3001 , () => {
  console.log("SERVER RUNNING");
});
