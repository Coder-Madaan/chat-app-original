import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import Logo from '../assests/logo.svg'
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { loginRoute } from '../utils/APIRoutes'
import{Link,useNavigate} from "react-router-dom"

function Login() {
  const navigate=useNavigate();
  const [values,setValue]=useState({
    username:"",
    password:"",
    
  })

  
  const toastOptions={
    position:"bottom-right",
    theme:"dark",
    pauseOnHover:true,
    draggable:true,
    autoClose:4000
  }

    useEffect(()=>{
      const redirect=async()=>{ if(localStorage.getItem("chat-app-user")){
        navigate("/")
      }}
      redirect();
      return () => {
         
      };
    },[])

  


  const handleSubmit= async (event)=>{
    event.preventDefault();
    if(handleValidation()){
      console.log("in validation",loginRoute)
      const{username,password}=values;
      const {data}= await axios.post(loginRoute,{
        username,password
      });
        if(data.status===false){
          toast.error(data.msg,toastOptions)
        }
        if(data.status===true){
          localStorage.setItem("chat-app-user",JSON.stringify(data.user))
          navigate("/")
        }
    }
    
  }
  
  
  const handleValidation=()=>{
    const{username,password}=values;
    

      
   if(username.length<3){
      toast.error("Username must contain atleast 3 characters",toastOptions)
      return false;
    }else if(password.length<8){
      toast.error("password must contain atleast 8 characters",toastOptions)
      return false;
    } 
    return true;
  }
  const handleChange=(event)=>{
    setValue({...values,[event.target.name]:event.target.value})
  }
  
  return (
    <>
    
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)} >
          <div className='brand'>
            <img src={Logo} alt="logo" />
            <h1>Snappy</h1>

          </div>
          <input type="text" placeholder='Username' name='username' onChange={(e)=>handleChange(e)} />
          {/* <input type="email" placeholder='E-Mail' name='email' onChange={(e)=>handleChange(e)} /> */}
          <input type="password" placeholder='Password' name='password' onChange={(e)=>handleChange(e)} />
          {/* <input type="password" placeholder='Confirm-Password' name='confirmPassword' onChange={(e)=>handleChange(e)} /> */}
        
        <button type='submit'>Login</button>
        <span>Don't have an account? 
        <Link to='/register'>Register</Link>
          </span>
        </form>
    </FormContainer>
    
    <ToastContainer/>
    </>
  )
}
const FormContainer=styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
gap:1rem;
background-color:#131324;
.brand{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:1rem;
  
}
img{
  height:5rem;
}
h1{
  color:white;
  text-transform:uppercase;
}
form{
  display:flex;
  flex-direction:column;
  gap:2rem;
  background-color:#00000076;
  border-radius:2rem;
  padding:3rem 5rem;
  input{
    background-color:transparent;
    padding:1rem;
    border:0.1rem solid #4e0eff;
    border-radius:0.4rem;
    color:white;
    width:100%;
    font-size:1rem;
    &:focus{
      outline:none;
      border:0.1rem solid #997af0;
    }
  }
  button{
    background-color:#997af0;
    color:white;
    padding:1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
    text-transform:uppercase;
    &:hover{
      background-color:#4e0eff
    }
  }
  span{
    color:white;
    text-transform:uppercase;
    a{
      color:#4e0eff;
      text-decoration:none;
      font-weight:bold;
    }
  }
}`;
export default Login
