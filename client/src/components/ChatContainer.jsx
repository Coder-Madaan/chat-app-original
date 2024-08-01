import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from '../components/Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentChat) {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id
          });
          console.log("Messages received:", response.data);
          
          const messages = response.data;
          console.log("Messages :", messages);
          setMessages(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      const response = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });

      const msgs = [...messages];
      if (response.data.message) {
        msgs.push(response.data.message);
      }
      setMessages(msgs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg.message, createdAt: msg.createdAt });
      });
    }
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"; // Handle missing date
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.log("Invalid date string:", dateString);
      return "Invalid Date";
    }
    
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  
  

  return (
    <>
      {currentChat && (
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
              <Logout />
            </div>
          </div>
          <div className="chat-messages">
          {messages.map((message, index) => {
  return (
    <div key={index} ref={scrollRef}>
      <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
        <div className="content">
          <p>{message.message}</p>
          <span className="timestamp">{formatDate(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
})}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
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
      .timestamp {
        display: block;
        font-size: 0.8rem;
        color: #a9a9a9;
        margin-top: 0.5rem;
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
  }
`;
