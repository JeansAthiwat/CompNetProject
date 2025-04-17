import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const LoginPage = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const {user, login, logout} = useAuth()
    const navigate = useNavigate()
    


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:39189/auth/login', {
              username: usernameRef.current.value,
              password: passwordRef.current.value
            });
          
            const data = response.data;  // Axios automatically parses the JSON body
          
            // No need for response.ok, Axios throws for non-2xx responses
            console.log("Login Successfully", data);
            
            login({ token:data.token, user: data.user });


            navigate('/profile');

            
        } catch (err) {
            // Handle different error types
            if (err.response) {
              // Server responded with a non-2xx status code
              console.error("Login failed", err.response.data);
              alert(`Error: ${err.response.data.message || 'Server error'}`);
            } else if (err.request) {
              // Request was made, but no response received
              console.error("No response received", err.request);
              alert("Error: No response from server. Please try again.");
            } else {
              // Something went wrong with the setup
              console.error("Request error", err.message);
              alert(`Error: ${err.message}`);
            }
        }
          
    }
    return (
        <>
        <div className="flex w-screen h-screen items-center justify-center">

        
            <form id="login-form" className="h-fit w-fit bg-white rounded-2xl shadow-2xl flex p-4 flex-col justify-between items-center ">
                <div>
                    <p className='input-label'>Username</p>
                    <input type='text' placeholder="NoobMaster69" ref={usernameRef} className='border-2 border-primary-stroke'></input>
                </div>
                <div>
                    <p className='input-label'>Password</p>
                    <input type='password' placeholder="" ref={passwordRef} className='border-2 border-primary-stroke'></input>
                </div>
                <Link className='text-blue-600 ' to='/register'>create an account?</Link>
                <button className='w-fit h-fit px-2 py-2 rounded-full bg-primary-stroke text-white' onClick={handleLogin}>login</button>
            </form>
        </div>
        </>
    )
}

export default LoginPage