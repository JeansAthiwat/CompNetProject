import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { useSocket } from "../Contexts/SocketContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UsersList from "../Components/UsersList";
import { useAuth } from "../Contexts/AuthContext";

const ChatRoom = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { isPrivate, to, roomName } = location.state || {};
    const { socket } = useSocket()
    const {token, user} = useAuth()
    const [convo, setConvo] = useState()
    const [messages, setMessages] = useState([])
    const inputRef = useRef()
    const chatContainerRef = useRef()
    const [userTyping, setUserTyping] = useState([])
    let typingTimeout = useRef(new Map());
    const { uid }= jwtDecode(token)

    
    const runInitRef = useRef(false)

    const getConvo = async (participants) => {
        if(isPrivate) {
            // Get private chat convo
            try {
                const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/conversation/private', {
                    participants: participants
                }, {
                    headers: {
                        'Content-Type':'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                // console.log(response.data.conv)
                setConvo(response.data.conv)
            } catch(err) {
                console.log(err)
            }
        } else {
            // Get group chat convo
            try{
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL+`/conversation/group/${to}`, {
                    headers: {
                        'Content-Type':'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setConvo(response.data.conv)
                // console.log(response.data.conv)
            } catch(err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        if (!socket) return; // 🚫 Don't run if socket hasn't been initialized
      
        const handlePrivateMessage = ({ sender, text }) => {
            // console.log('send by', sender)
            setMessages((prev) => [...prev, { sender, text }]);
        };

        const updateGroupMemberLeave = ({roomId, target}) => {
            if(roomId===to) {
                setConvo((prev) => {return {...prev, participants:prev.participants.filter((p)=>p._id!==target._id)}})
            }
        }
        
        const updateGroupMemberJoin = ({roomId, target}) => {
            console.log("check convo", target)
            if(roomId===to) {
                setConvo((prev) => {return {...prev, participants:[...prev.participants, {_id:target._id, displayName:target.displayName, avatarIndex:target.avatarIndex}]}})
            }
        }

        const handleTyping = ({sender, displayName} = {}) => {
            if ((!sender) || (sender && sender === to)) {
                // do something
                setUserTyping((prev) => prev.includes(displayName)?prev:[...prev, displayName]);
    
                if (typingTimeout.current.get(displayName)) {
                    clearTimeout(typingTimeout.current.get(displayName));
                }
            
                // User stops typing after 1.5 seconds of no input
                typingTimeout.current.set(displayName, setTimeout(() => {
                    setUserTyping((prev) => prev.filter(dn => dn!==displayName));
                }, 1500))
            }
        }

        socket.on("typing", handleTyping)   
        if(isPrivate) {
            socket.on("private message", handlePrivateMessage);    
            return () => {
                socket.off("private message", handlePrivateMessage);
                socket.off("typing", handleTyping)   
            };
        } else {
            socket.emit("enter room", {roomId:to, user})
            socket.on("group message", handlePrivateMessage);
            socket.on("join group",updateGroupMemberJoin)
            socket.on("leave group",updateGroupMemberLeave)
            return () => {
                socket.emit("exit room", {roomId: to, user})
                socket.off("group message", handlePrivateMessage);
                socket.off("join group",updateGroupMemberJoin)
                socket.off("leave group",updateGroupMemberLeave)
                socket.off("typing", handleTyping)   
              };
        }
      
      }, [socket, location.state]);
      
    
    useEffect(() => {           
        getConvo([uid, to])
    }, [location.state])

    useEffect(() => {
        if(convo) {
            const getMessages = async () => {
                // console.log("convoId",convoId)
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL+`/message/id/${convo._id}`, {
                    headers: {
                        'Content-Type':'application/json',
                        authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                })
                setMessages(response.data.messages)
            }
            getMessages()
        }
    }, [convo])

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [messages]);

    const goBack = () => {
        navigate("/home")
    }

    const sendMsg = () => {
        const text = inputRef.current.value
        if (text.trim() === "") return;
        if(isPrivate) {
            socket.emit("private message", {
                cid:convo._id,
                sender:uid,
                reciever:to,
                text
            })
        } else {
            socket.emit("group message", {
                cid:convo._id,
                sender:uid,
                text
            })
        }
        setMessages((prev) => [...prev, {"sender":{"displayName":user.displayName, '_id':user._id}, text}])
        inputRef.current.value = ""
    }

    const sendTyping = () => {
        if(isPrivate) {
            socket.emit("private typing", {sender:uid, reciever:to})
        } else {
            socket.emit("group typing", {cid:convo._id})
        }
    }

    return (
        <>
            {convo && socket && <>
            <div className=" w-screen  flex border-primary-stroke border-b-2 font-bold text-3xl pt-4 pb-2 pl-15">
                            <button className="back-button" onClick={goBack}>←</button>
                            <h2 className="pl-2">{roomName}</h2>
            </div>
            <div className=" flex flex-row h-[80vh]">
                <div>
                <div className="h-[75vh] chat-body w-[80vw] grow py-5 pr-5 pl-15 overflow-y-scroll scroll-smooth flex flex-col"  ref={chatContainerRef}>
                    {
                        messages.map((msg,index) => 
                            msg.sender._id == uid ?
                            <div className="message-item relative flex items-end my-2 ml-auto" key={index}>
                                {/* Message bubble */}
                                <div className="bg-secondary-bg py-2 px-4 rounded-2xl h-fit w-fit font-bold text-xl mb-2">
                                    {msg.text}
                                </div>
                            </div>
                            :
                            <div className="message-item relative flex items-end mt-3 mb-9" key={index}>
                                <div className="sender flex flex-col items-start mr-3 relative">
                                    {/* Sender name floating above */}
                                    <div className="pf-name absolute -top-6 left-0 text-lg font-semibold whitespace-nowrap">
                                    {msg.sender.displayName}
                                    </div>
                                    
                                    {/* Avatar */}
                                    <div className={`pf-img w-[4rem] h-[4rem] rounded-full mt-2 overflow-hidden`}>
                                        <img
                                            src={`/avatars/avatar${msg.sender.avatarIndex}.jpg`}
                                            alt={`Avatar ${msg.sender.avatarIndex}`}
                                        />
                                    </div>
                                </div>

                                {/* Message bubble */}
                                <div className="bg-secondary-bg py-2 px-4 rounded-2xl h-fit w-fit font-bold text-xl mb-2">
                                    {msg.text}
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className={`flex justify-center h-[5vh]`}>
                    <h1 className={`text-xl font-bold ${userTyping.length?"":"hidden"}`}>{userTyping.join(", ")} is typing...</h1>
                </div>
                <div className="chat-footer flex justify-between w-[80vw] mb-4 pl-15">
                    {/* <button className="footer-button bg-primary-stroke text-white text-xl font-bold py-2 px-4 rounded-full">Giphy</button> */}
                    <input onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              sendMsg();
                            }
                        }}
                        onChange={sendTyping}
                        ref={inputRef} type="text" className="chat-input bg-secondary-bg py-2 px-4 rounded-2xl grow mx-2 text-xl font-bold" />
                    <button className="footer-button bg-primary-stroke text-white text-xl font-bold py-2 px-4 rounded-full"
                        onClick={sendMsg}
                    >
                        Send
                    </button>
                </div>
                </div>

                <UsersList users={convo.participants} active={!isPrivate} header={"Members"}/>

            </div>
            </>
            }</>
    )
}

export default ChatRoom