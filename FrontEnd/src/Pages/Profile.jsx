import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useAuth } from "../Contexts/AuthContext";

function Profile() {
  const displayNameRef = useRef()
  const {token, user, setUser} = useAuth();
  const [avatarIndex, setAvatarIndex] = useState(() => user?.avatarIndex|| 0);
  const navigate = useNavigate();

  console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (displayNameRef.current.value.trim()) {
      const response = axios.patch('http://localhost:39189/user', {
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
      localStorage.setItem("user", JSON.stringify(user));
      
      navigate("/home")
    }
  };

  const avatarOptions = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#fef6d7]">
      <h2 className="text-8xl font-bold mb-6 text-[#7d5a50]">Blind Date</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          ref={displayNameRef}
          defaultValue={user.displayName || ""}
          className="px-6 py-2 text-lg border-2 border-[#7d5a50] rounded-md mb-4 w-144 text-center bg-white"
        />
        <div className="flex gap-4 mb-4">
          {avatarOptions.map((i) => (
            <img
              key={i}
              src={`/avatars/avatar${i}.jpg`}
              alt={`Avatar ${i}`}
              className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                avatarIndex === i ? "border-[#7d5a50]" : "border-transparent"
              }`}
              onClick={() => setAvatarIndex(i)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="py-2 px-4 rounded-full bg-primary-stroke border-2 border-[#7d5a50] text-white hover:brightness-70 transition"
        >
          Start Chatting
        </button>
      </form>
    </div>
  );
}

export default Profile;
