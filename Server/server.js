import 'dotenv/config';
import express from "express";
import http from 'http'
import cors from 'cors'
import { connectDB } from "./lib/db.js";
import userRouter from './routes/userRouter.js';
import { Server } from 'socket.io';
import messageRouter from './routes/messageRouter.js';


const app = express()
const server = http.createServer(app);
//express will just listen to an http request process it and will return some json data but it cant undersatnd the socket header and cant implement this thing coz it(express) is a http routing framework but http is just a network listener

export const io = new Server(server, {
    cors : {origin : "*"}
})

export const socketUsers = {} // this is mutable as we are just changing the values inside the object and not creating a new block which it will certainly block

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) socketUsers[userId] = socket.id;
    
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(socketUsers));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete socketUsers[userId];
        io.emit("getOnlineUsers", Object.keys(socketUsers))
    })
})


app.use(express.json({limit : '4mb'}))
app.use(cors())

app.get('/api/status' , (req, res) => (res.send("mera naam chinchinchu")))
app.use('/api/auth' , userRouter)
app.use('/api/messages' , messageRouter)


await connectDB()


const port = process.env.PORT || 5000
server.listen(port , (req, res)=> console.log("Server is live : " + port))