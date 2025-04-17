import React, { useEffect, useState } from 'react';
import UsersList from '../Components/UsersList';
import GroupsList from '../Components/GroupsList';
import { useSocket } from '../Contexts/SocketContext.jsx';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';


export default function Home() {
    const [users, setUsers] = useState([])
    const {socket} = useSocket()
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!socket) return;
    
        const getOnlineUsers = async () => {
            try {
                const response = await axios.get('http://localhost:39189/user/online');
                setUsers(response.data.users);
                console.dir(response.data)
                console.dir(user)
            } catch (error) {
                console.error("Error fetching online users:", error);
            }
        };
    
        socket.on('user:joined', getOnlineUsers);
        socket.on('user:leaved', getOnlineUsers);
        getOnlineUsers();
    
        return () => {
            socket.off('user:joined', getOnlineUsers);
            socket.off('user:leaved', getOnlineUsers);
        };
    }, [socket]);
    
    const onLogOut = () => {
        logout()
        navigate('/')
    }

  return users.length>0 &&(
        
        <div className="flex flex-row grow w-screen justify-center h-screen">
        <div className='hidden lg:block'>
        <UsersList users={users}
            header={"Active Users"}/>
        </div>
        
        <GroupsList groups={[{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }]} />
        <div className="flex flex-col items-center justify-between">
            <UsersList header={"Members"}
            users={[]} />
            <button onClick={onLogOut}
                // onClick={onClick}
                className="fixed bottom-6 right-30 w-20 h-20 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-[#5e413b] transition"
                aria-label="Add"
                >
                Log out
            </button>
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

    </div>);
}