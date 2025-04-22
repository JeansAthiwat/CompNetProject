import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export default function GroupsList({ groups, onGroupFocus }) {
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
                className={`flex flex-row h-40 w-full p-10 gap-4 items-center border-primary-stroke hover:bg-secondary-bg/50 rounded-full ${group.id===focusedId?"bg-secondary-bg/60 border-4":"bg-secondary-bg border-2"}`}
                onClick={() => {handleClick(group)}}
              >
                <h3 className="text-3xl font-bold truncate">{group.name}</h3>
              </div>
            ))}
          </div>
        </div>
      );
}
