// Components/UsersList.js

import React from "react";

export default function UsersList({ users, header }) {
  return (
    <div className="h-screen w-[20vw] flex flex-col ">
      <h1 className="text-5xl font-bold py-4 px-2 border-b-2 border-primary-stroke text-center ">
        {header}
      </h1>
      {/* <div className="border-b-2 border-primary-stroke">search bar</div> */}
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 items-center ">
        
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-row w-full p-2 gap-4 items-center border-2 border-primary-stroke bg-secondary-bg rounded-2xl"
          >
            <img
              src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSMDqhEJR6Udf0kawcsUab8zTjta2rfznDcUyzGuPe1-Gh81zPBjX9_fQjEl585aZQqRuE1Lif0d0rUjwj3pkviGygMizp3mKTc-spwIQ"
              alt="user-profile"
              className="w-20 h-20 rounded-full"
            />
            <h3 className="text-2xl font-bold">{user.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
