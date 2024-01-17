import React,{useState,useEffect,useRef} from 'react'
import styled from 'styled-components'
import Logout from '../components/Logout'
import ChatInput from './ChatInput'
import Messages from './Messages'
import axios from 'axios'
import { sendMessageRoute,getAllMessagesRoute } from '../utils/APIRoutes'
// import {v4 as uuidv4} from "uuid";

export default function ChatContainer({currentChat,currentUser,socket }) {
    const scrollRef=useRef();
    const [messages,setMessages]=useState([]);
    const [arrivalMessage,setArrivalMessage]=useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser && currentChat) {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id
                    });
                    // console.log('Message Data:', response.data);
                    // console.log(response.data);
                    setMessages(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
        return () => {
        };
    }, [ currentChat]);
    
    

    const handleSendMsg=async(msg)=>{
       await axios.post(sendMessageRoute,{
        from:currentUser._id,
        to:currentChat._id,
        message:msg
       })
       socket.current.emit("send-msg",{
        to:currentChat._id,
        from:currentUser._id,
        message:msg,
       })

       const msgs=[...messages]
       msgs.push({fromSelf:true,message:msg});
       setMessages(msgs);
    }

    useEffect(()=>{
      const arrivalMsg=()=>{if(socket.current){
        socket.current.on("msg-receive",(msg)=>{
            setArrivalMessage({fromSelf:false,message:msg})
        })
      }}
      arrivalMsg();
      return()=>{}
      
    },[])

    useEffect(()=>{
      const setMsg=()=>{arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage])}
      setMsg();
      return()=>{}
    },[arrivalMessage])

    useEffect(()=>{
      const scrollREF=()=>{scrollREF.current?.scrollIntoView({behaviour:'smooth'})}
      scrollREF();
      return()=>{}
    },[messages])

  return (
    <>
    { currentChat && (
        
        <Container>
        <div className="chat-header">
        <div className="user-details">
        <div className="avatar">
        <img
        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
        alt="avatar"
        />
        <div className="username">
        <h3>{currentChat.username}</h3>
        </div>
        </div>
        <Logout/>
        </div>
        </div>
        <div className="chat-messages">
        {messages.map((message,index) => {
            //  console.log(message); 
          return (
            <div  key={index} ref={scrollRef}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "received"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        <ChatInput handleSendMsg={handleSendMsg}/>
        </Container>
        )
}
    
        </>
  )
}
const Container=styled.div` display: grid;
grid-template-rows: 15% 75% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #4f04ff21;
    }
  }
  .received {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}`
