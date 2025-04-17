// Components/UsersList.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function UsersList({ users, header }) {
  const navigate = useNavigate()

  const handleClick = (id, name) => {
    if(id !== jwtDecode(localStorage.getItem("token"))) {
      // console.log(id)
      navigate("/chat", { state: { isPrivate:true, to:id, roomName:name } })
    }
  }
  // console.log("This is users:",users)
  return (
    <div className="h-screen w-[20vw] flex flex-col ">
      <h1 className="text-5xl font-bold py-4 px-2 border-b-2 border-primary-stroke text-center ">
        {header}
      </h1>
      {/* <div className="border-b-2 border-primary-stroke">search bar</div> */}
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 items-center ">
        
        {users.map((user, index) => (
          <div
            key={index}
            className="flex flex-row w-full p-2 gap-4 items-center border-2 border-primary-stroke bg-secondary-bg rounded-2xl"
            onClick={() => handleClick(user.id, user.name)}
          >
            <img
              src={`/avatars/avatar${user.avatarIndex}.jpg`}
              alt={`Avatar ${user.avatarIndex}`}
              className="w-20 h-20 rounded-full"
            />
            <h3 className="text-2xl font-bold">{user.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
