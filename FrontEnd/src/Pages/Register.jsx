import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { Link } from "react-router-dom"
import { Heart, User, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../Contexts/AuthContext"

const Register = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const {login} = useAuth()

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if(passwordRef.current.value != confirmPasswordRef.current.value) {
            alert('Password does not match!!')
            return
        }
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/auth/register', {
              username: usernameRef.current.value,
              password: passwordRef.current.value
            });
          
            // Axios automatically throws error for non-2xx responses, so no need for response.ok
            const data = response.data;
          
            console.log("Register Successfully", data);
            login({ token:data.token, user: data.user });
            navigate('/profile');
            
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
        <div className="min-h-screen flex items-center justify-center px-4" 
        style={{ background: 'var(--color-primary-bg)' }}>
            <div className="paper-effect w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
                <div className="text-center space-y-2">
                    <Heart className="mx-auto text-primary w-12 h-12" />
                    <h1 className="text-4xl font-handwritten font-bold text-primary">Blind Date</h1>
                    <p className="text-muted-foreground font-handwritten text-xl">Find your match...</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-6">
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

                    <div className="space-y-2">
                        <label className="font-handwritten text-lg">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                ref={confirmPasswordRef}
                                placeholder="••••••••"
                                className="w-full pl-9 pr-9 border-2 border-primary-stroke rounded-md p-2"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full font-handwritten text-lg bg-primary-stroke text-white py-2 rounded-full"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center">
                    <Link 
                        to="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-handwritten"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register