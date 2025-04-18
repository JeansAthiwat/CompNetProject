import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export default function GroupsList({ groups, onGroupFocus }) {
    const navigate = useNavigate()
    const {user} = useAuth()
    const [focusedId, setFocusedId] = useState(null)

    const handleClick = (group) => {
      //send data to parent
      onGroupFocus(group)

      //render focus effect
      setFocusedId(group.id)
    }

    return (
        <div className="h-screen w-full min-w-80 lg:w-[60vw] flex flex-col border-x-2 border-primary-stroke">
          <h1 className="text-5xl font-bold py-4 px-2 border-b-2 border-primary-stroke text-center ">
            Groups
          </h1>
          {/* <div className="border-b border-primary-stroke">search bar</div> */}
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-4 items-center ">
            
            {groups.map((group) => (
              <div
                key={group.id}
                className={`flex flex-row h-40 w-full p-10 gap-4 items-center border-primary-stroke bg-secondary-bg rounded-full ${group.id===focusedId?"border-5":"border-2"}`}
                onClick={() => {handleClick(group)}}
              >
                <img
                  src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSMDqhEJR6Udf0kawcsUab8zTjta2rfznDcUyzGuPe1-Gh81zPBjX9_fQjEl585aZQqRuE1Lif0d0rUjwj3pkviGygMizp3mKTc-spwIQ"
                  alt="user-profile"
                  className="w-20 h-20 rounded-full"
                />
                <h3 className="text-3xl font-bold truncate">{group.name}</h3>
              </div>
            ))}
          </div>
        </div>
      );
}
