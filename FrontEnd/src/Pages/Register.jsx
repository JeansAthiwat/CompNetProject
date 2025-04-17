import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { Link } from "react-router-dom"

const Register = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()

    const navigate = useNavigate()

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if(passwordRef.current.value != confirmPasswordRef.current.value) {
            alert('Password does not match!!')
            return
        }
        try {
            const response = await axios.post('http://localhost:39189/auth/register', {
              username: usernameRef.current.value,
              password: passwordRef.current.value
            });
          
            // Axios automatically throws error for non-2xx responses, so no need for response.ok
            const data = response.data;
          
            console.log("Register Successfully", data);
            login({ token:data.token, user: data.user });
            navigate('/home');
            
        } catch (err) {
            // Handle different error types
            if (err.response) {
              // Server responded with a non-2xx status code
              console.error("Failed to register", err.response.data);
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

    const avatarOptions = Array.from({ length: 5 }, (_, i) => i);
    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center">
                <form id="register-form" className="h-fit w-fit bg-white rounded-2xl shadow-2xl flex p-5 flex-col justify-between items-center">
                    <div>
                        <p className='input-label'>Username</p>
                        <input type='text' placeholder="NoobMaster69" ref={usernameRef} className='border-2 border-primary-stroke'></input>
                    </div>
                    <div>
                        <p className='input-label'>Password</p>
                        <input type='password' placeholder="" ref={passwordRef} className='border-2 border-primary-stroke'></input>
                    </div>
                    <div>
                        <p className='input-label'>Confirm Password</p>
                        <input type='password' placeholder="" ref={confirmPasswordRef} className='border-2 border-primary-stroke'></input>
                    </div>
                    <Link className='text-blue-600 ' to='/'>Already have an account</Link>
                    <button className='w-fit h-fit px-2 py-2 rounded-full bg-primary-stroke text-white' onClick={handleRegisterSubmit}>Register</button>
                </form>
            </div>
        </>
    )
}

export default Register