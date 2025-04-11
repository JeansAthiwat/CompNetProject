import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/SocketContext";

function Landing() {
  const [name, setName] = useState(() => sessionStorage.getItem("name") || "");
  const [avatarIndex, setAvatarIndex] = useState(() => {
    const saved = sessionStorage.getItem("avatarIndex");
    return saved !== null ? Number(saved) : 0;
  });

  const navigate = useNavigate();
  const { connectSocket } = useSocket();

  useEffect(() => {
    sessionStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    sessionStorage.setItem("avatarIndex", avatarIndex);
  }, [avatarIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      connectSocket(name, avatarIndex)

      navigate("/home", {
        state: {
          name,
          avatarIndex,
        },
      });
    }
  };

  const avatarOptions = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#fef6d7]">
      <h2 className="text-8xl font-bold mb-6 text-[#7d5a50]">Blind Date</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
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

export default Landing;
