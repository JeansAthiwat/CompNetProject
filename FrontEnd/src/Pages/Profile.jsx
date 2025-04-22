import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useAuth } from "../Contexts/AuthContext";

function Profile() {
  const displayNameRef = useRef()
  const {token, user, logout, setUser} = useAuth();
  const [avatarIndex, setAvatarIndex] = useState(() => user?.avatarIndex|| 0);
  const [themeIndex, setThemeIndex] = useState(() => user?.themeIndex || 0);
  const navigate = useNavigate();
  const themeOptions = ['#ded2ad', '#363636', '#8E1616'];
  const onLogOut = () => {
          logout()
          navigate('/')
      }
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (displayNameRef.current.value.trim()) {
        const response = axios.patch(import.meta.env.VITE_BACKEND_URL+'/user', {
          displayName:displayNameRef.current.value,
          avatarIndex
        }, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        console.log(response.data)
        console.log(user)
        setUser(prev => ({
          ...prev,
          displayName: displayNameRef.current.value,
          avatarIndex,
        }));
        // console.log(user)

      }
    } catch (error) {
      console.log(error)
    } finally {
      // localStorage.setItem("user", JSON.stringify(user));   
      navigate("/home")
    }

  };

  const handleThemeChange = async (i)=> {
    try {
      const response = axios.patch(import.meta.env.VITE_BACKEND_URL+'/user', {
        themeIndex:i,
      }, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      setUser(prev => ({
        ...prev,
        themeIndex: i,
      }));
      setThemeIndex(i);
    } catch (error) {
      console.log(error)
    }
  }

  const avatarOptions = Array.from({ length: 5 }, (_, i) => i);
  
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center"
    style={{ background: 'var(--color-primary-bg)' }}>
      <h2 className="text-8xl font-bold mb-6 text-primary-stroke">Blind Date</h2>
      <div className="flex gap-4 mb-4">
          {themeOptions.map((theme, i) => (
            <div 
              key={i}
              className={`w-16 h-16 rounded-full cursor-pointer  ${
                themeIndex === i ? "border-primary-stroke border-4" : "border-transparent"
              }`}
              style={{ background: theme }}
              onClick={() => handleThemeChange(i)}>
            </div>
          ))}
        </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          ref={displayNameRef}
          defaultValue={user.displayName || ""}
          className="px-6 py-2 text-black text-lg border-2 border-primary-stroke rounded-md mb-4 w-144 text-center bg-white"
        />
        <div className="flex gap-4 mb-4">
          {avatarOptions.map((i) => (
            <img
              key={i}
              src={`/avatars/avatar${i}.jpg`}
              alt={`Avatar ${i}`}
              className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                avatarIndex === i ? "border-primary-stroke" : "border-transparent"
              }`}
              onClick={() => setAvatarIndex(i)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
        <button
          type="submit"
          className="w-50  py-2 px-4 rounded-full border-primary-stroke border-2 bg-secondary-bg text-primary-stroke hover:brightness-70 transition"
        >
          Start Chatting
        </button>
          <button onClick={onLogOut}
            className="w-50 py-2 px-4 rounded-full bg-primary-stroke border-2 border-secondary-bg text-primary-bg hover:brightness-70 transition"
                      >
                      Log out
          </button>
        </div>

      </form>
    </div>
  );
}

export default Profile;
