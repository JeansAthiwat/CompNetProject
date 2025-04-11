import React, { useEffect, useState } from 'react';
import UsersList from '../Components/UsersList';
import GroupsList from '../Components/GroupsList';
import { getSocket } from '../socket.js';
export default function Home() {
    const [users, setUsers] = useState([])
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        const retrieveSocket = () => {
            const socketInstance = getSocket()
            console.log("socketInstance", socketInstance)
            setSocket(socketInstance)
            socketInstance.on("user:joined",getUsers)
            socketInstance.on("user:leaved",getUsers)
        }
        const getUsers = async () => {
            const response = await fetch('http://localhost:39189/api/users')
            const data = await response.json()
            console.log("kuy",data.users);
            setUsers([...users, ...data.users])
        }
        retrieveSocket()
        getUsers()
    }, [])
  return (
    <div className="flex flex-row grow w-screen justify-center h-screen">
        <UsersList users={users.map((user)=>({id:user.userId,name:user.username,avatarIndex:user.avatarIndex}))} 
            header={"Active Users"}/>
        <GroupsList groups={[{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }]} />
        <div className="flex flex-col items-center justify-between">
            <UsersList header={"Members"}
            users={[{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]} />
            <button
                // onClick={onClick}
                className="fixed bottom-6 right-6 w-20 h-20 flex items-center justify-center rounded-full bg-primary-stroke text-white shadow-lg hover:bg-[#5e413b] transition"
                aria-label="Add"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>

    </div>
  );
}