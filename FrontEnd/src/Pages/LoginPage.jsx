import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { Link } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"
import { Heart, User, Lock, Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [showPassword, setShowPassword] = useState(false)
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
        <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--color-primary-bg)' }}>
            <div className="paper-effect w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
                <div className="text-center space-y-2">
                    <Heart className="mx-auto text-primary w-12 h-12" />
                    <h1 className="text-4xl font-handwritten font-bold text-primary">Blind Date</h1>
                    <p className="text-muted-foreground font-handwritten text-xl">Find your match...</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="font-handwritten text-lg">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                ref={usernameRef}
                                placeholder="Enter username"
                                className="w-full pl-9 border-2 border-primary-stroke rounded-md p-2 font-handwritten"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-handwritten text-lg">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type={showPassword ? "text" : "password"}
                                ref={passwordRef}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-9 border-2 border-primary-stroke rounded-md p-2"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full font-handwritten text-lg bg-primary-stroke text-white py-2 rounded-full"
                    >
                        Start Chatting
                    </button>
                </form>

                <div className="text-center">
                    <Link 
                        to="/register"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-handwritten"
                    >
                        Need an account? Register
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage