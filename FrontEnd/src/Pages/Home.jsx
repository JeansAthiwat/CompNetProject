import React, { useEffect, useState } from 'react';
import UsersList from '../Components/UsersList';
import GroupsList from '../Components/GroupsList';
import GroupCreationForm from '../Components/GroupCreationForm'
import { useSocket } from '../Contexts/SocketContext.jsx';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Components/ui/LoadingScreen.jsx';


export default function Home() {
    const [users, setUsers] = useState([])
    const [chatGroups, setChatGroups] = useState([])
    const {socket} = useSocket()
    const {user, logout, token} = useAuth()
    const [createGroup, setCreateGroup] = useState(false)
    const [focusedGroup, setFocusedGroup] = useState({participants:[]})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    const getChatGroups = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:39189/conversation/group')
            setChatGroups(response.data.groups)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (!socket?.connected) return;
    
        const getOnlineUsers = async () => {
            try {
                setLoading(true)
                const response = await axios.get('http://localhost:39189/user/online');
                setUsers(response.data.users);
                console.dir(response.data)
                // console.dir(user)
            } catch (error) {
                console.error("Error fetching online users:", error);
            } finally{
                setLoading(false)
            }
        };

        const updateFocusedGroupJoin = ({roomId, target}) => {
            setFocusedGroup((prev) => {return roomId===prev.id ? 
                {...prev, participants:[...prev.participants, {_id:target._id, displayName:target.displayName, avatarIndex:target.avatarIndex}]}
                :
                prev})
        }

        const updateFocusedGroupLeave = ({roomId, target}) => {
            setFocusedGroup((prev) => {return roomId===prev.id ?
                {...prev, participants:prev.participants.filter((p)=>p._id!==target._id)}
                :
                prev})
        }
    
        socket.on('user:joined', getOnlineUsers);
        socket.on('user:leaved', getOnlineUsers);
        socket.on('new group', getChatGroups)
        socket.on('join group', updateFocusedGroupJoin)
        socket.on('leave group', updateFocusedGroupLeave)
        getOnlineUsers();
        
        return () => {
            socket.off('user:joined', getOnlineUsers);
            socket.off('user:leaved', getOnlineUsers);
            socket.off('join group', updateFocusedGroupJoin)
            socket.off('leave group', updateFocusedGroupLeave)
        };
    }, [socket?.connected]);

    useEffect(() => {
        getChatGroups()
    }, [])
    
    const onGroupFocus = (group) => {
        setFocusedGroup(group)
    }

    const onEnterChat = () => {
        navigate("/chat", { state: { isPrivate:false, to:focusedGroup.id, roomName:focusedGroup.name } })
    }

    const onLeaveGroup = async () => {
        try {
            const response = await axios.put(`http://localhost:39189/conversation/group/leave/${focusedGroup.id}`, null,{
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            await getChatGroups()
            setFocusedGroup({...focusedGroup, participants:focusedGroup.participants.filter((p)=>p._id!==user._id)})
            socket.emit("leave group",{roomId:focusedGroup.id, target:user})
        } catch(err) {
            console.log(err)
        }
    }

    const onJoinGroup = async () => {
        try {
            const response = await axios.put(`http://localhost:39189/conversation/group/${focusedGroup.id}`, null,{
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            await getChatGroups()
            setFocusedGroup({...focusedGroup, participants:[...focusedGroup.participants, {_id:user._id, displayName:user.displayName, avatarIndex:user.avatarIndex}]})
            socket.emit("join group",{roomId:focusedGroup.id, target:user})
        } catch(err) {
            console.log(err)
        }
    }

    const onLogOut = () => {
        logout()
        navigate('/')
    }

  return loading ? <LoadingScreen /> : (
        
        <div className="flex flex-row grow w-screen justify-center h-screen">
        <div className='hidden lg:block'>
        <UsersList users={users}
            header={"Active Users"}/>
        </div>
        
        <GroupsList groups={chatGroups.map((group) => {return {id:group._id, name:group.name, participants:group.participants}})}
        onGroupFocus={onGroupFocus} />
        {   !createGroup ?
            <div className="flex flex-col items-center justify-between">
                <UsersList header={"Members"}
                users={focusedGroup.participants} />
                {
                    focusedGroup.id &&
                    <div className="absolute bottom-28 flex flex-col items-center">
                        {
                            focusedGroup.participants.some(p => p._id.toString() === user._id.toString()) ?
                            <>
                            <button onClick={onEnterChat}
                                className="px-4 py-2 text-3xl rounded-full bg-primary-stroke text-white shadow-lg hover:bg-[#5e413b] transition mb-2"
                                >
                                Enter Chat   
                            </button>
                            <button onClick={onLeaveGroup}
                                className="px-4 py-2 text-3xl rounded-full bg-primary-stroke text-white shadow-lg hover:bg-[#5e413b] transition"
                                >
                                Leave
                            </button>
                            </>
                            :
                            <button onClick={onJoinGroup}
                                className="px-4 py-2 text-3xl rounded-full bg-primary-stroke text-white shadow-lg hover:bg-[#5e413b] transition"
                                >
                                Join
                            </button>
                        }
                    </div>
                }
                <button onClick={onLogOut}
                    className="fixed bottom-6 right-30 w-20 h-20 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-[#5e413b] transition"
                    >
                    Log out
                </button>
                <button
                    onClick={()=>{setCreateGroup(true)}}
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
            :
            <div className="flex flex-col items-center justify-between">
                <div className="h-screen w-[20vw] min-w-50 flex flex-col">
                    <GroupCreationForm />
                </div>
                <button
                    onClick={()=>{setCreateGroup(false)}}
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
        }

    </div>);
}