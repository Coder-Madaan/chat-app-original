import React from 'react'
import styled from 'styled-components'
import Robot from '../assests/robot.gif'

export default function Welcome({currentUser}) {
  return (
   <Container>
    <img src={Robot} alt="robot" />
    <h1>Welcome <span>{currentUser.username}!</span></h1>
    <h3>Please select a chat to start messaging</h3>
   </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  height: 100%;
  
  img {
    height: 20rem;
  }
  
  span {
    color: #4e0eff;
  }

  h1 {
    margin-top: 1rem;
  }

  h3 {
    margin-top: 1rem;
  }

  @media screen and (max-width: 768px) {
    img {
      height: 15rem;
    }

    h1 {
      font-size: 1.5rem;
      text-align: center;
    }

    h3 {
      font-size: 1rem;
      text-align: center;
    }
  }

  @media screen and (max-width: 480px) {
    img {
      height: 10rem;
    }

    h1 {
      font-size: 1.2rem;
    }

    h3 {
      font-size: 0.9rem;
    }
  }
`;