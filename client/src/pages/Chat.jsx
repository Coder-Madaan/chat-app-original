import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

function Chat() {

  const socket=useRef()
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded,setIsLoaded]=useState(false);

 

  useEffect(() => {
    const redirectLogin = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
  
    redirectLogin();
  
    return () => {
      // Cleanup code, if needed
    };
  }, []);
  
  useEffect(()=>{
    const SOCKET=()=>{if (currentUser){
      socket.current=io(host);
      socket.current.emit("add-user",currentUser._id)
    }}
    SOCKET();
    return ()=>{};
    
  })

  

  useEffect( () => {
    const currentUSER=async()=>{if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }}
    currentUSER();
    return () => {
         
    };
    
  }, [currentUser]);
  
  const handleChatChange=(chat)=>{
    setCurrentChat(chat)
  }
  return (
    <Container className="h-[100vh] w-[100vw] flex flex-col justify-center items-center gap-4 bg-[#131324] ">
      <div className="container h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-2">
        <Contacts  contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        
        {isLoaded && currentChat===undefined?<Welcome currentUser={currentUser}/>:<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>}
      </div>
    </Container>
  )
}

const Container=styled.div`
height: 100vh;
 width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    @media screen and (min-width: 480 px) and (max-width: 720) {
      grid-template-columns: 45% 55%;
    }
      @media screen and (min-width: 360 px) and (max-width: 480) {
      grid-template-columns: 60% 40%;
    }
  }
`
export default Chat
