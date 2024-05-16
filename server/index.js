const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const socket =require("socket.io")

const userRoutes=require("./routes/userRoutes.js")
const messagesRoute=require("./routes/messagesRoutes.js")

const app =express();
require("dotenv").config()

app.use(cors())
app.use(express.json())

app.use("/api/auth",userRoutes)  //api for routes
app.use("/api/messages",messagesRoute)  

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true
}).then(()=>{
    console.log("Mongo connected")
}).catch((err)=>{
    console.log(err)
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server running on port:${process.env.PORT}`)
})

const io=socket(server,{
    cors:{
        origin:"chat-app-original.vercel.app",
        credentials:true,
    }
});

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })

    socket.on("send-msg",(data)=>{
        const sendUserSocket =onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data.message);
        }
    })
})
