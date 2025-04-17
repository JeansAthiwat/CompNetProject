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
    const chatBottomRef = useRef()
    const chatContainerRef = useRef()
    const { uid }= jwtDecode(token)

    
    const runInitRef = useRef(false)

    const getConvo = async (participants) => {
        try {
            const response = await axios.post('http://localhost:39189/conversation/private', {
                participants: participants
            }, {
                headers: {
                    'Content-Type':'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(response.data)
            setConvo(response.data.conv)
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!socket) return; // 🚫 Don't run if socket hasn't been initialized
      
        const handlePrivateMessage = ({ sender, text }) => {
          setMessages((prev) => [...prev, { sender, text }]);
        };
      
        socket.on("private message", handlePrivateMessage);
      
        return () => {
          socket.off("private message", handlePrivateMessage);
        };
      }, [socket]);
      
    
    useEffect(() => {
        if(!runInitRef.current) {
            runInitRef.current = true
            if(isPrivate) {                
                getConvo([uid, to])
            }
        }
    }, [])

    useEffect(() => {
        if(convo) {
            const getMessages = async () => {
                // console.log("convoId",convoId)
                const response = await axios.get(`http://localhost:39189/message/id/${convo._id}`, {
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
        socket.emit("private message", {
            cid:convo._id,
            sender:uid,
            reciever:to,
            text
        })
        setMessages((prev) => [...prev, {"sender":{"displayName":user.displayName, '_id':user._id}, text}])
        inputRef.current.value = ""
        // chatBottomRef.current.scrollIntoView()
    }

    return (
        <>
            {convo && socket && <>
            <div className=" w-screen  flex border-primary-stroke border-b-2 font-bold text-3xl pt-4 pb-2 pl-15">
                            <button className="back-button" onClick={goBack}>←</button>
                            <h2 className="pl-2">{roomName}</h2>
            </div>
            <div className=" flex flex-row h-[100vh]">
                <div>
                <div className="h-[80vh] chat-body w-[80vw] grow py-5 pr-5 pl-15 overflow-y-scroll scroll-smooth flex flex-col"  ref={chatContainerRef}>
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
                    <div ref={chatBottomRef} className="chat-bottom h-0"></div>
                </div>

                <div className="chat-footer flex justify-between w-[80vw] mb-4 pl-15 mt-5">
                    <button className="footer-button bg-primary-stroke text-white text-xl font-bold py-2 px-4 rounded-full">Giphy</button>
                    <input onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              sendMsg();
                            }
                        }}ref={inputRef} type="text" className="chat-input bg-secondary-bg py-2 px-4 rounded-2xl grow mx-2 text-xl font-bold" />
                    <button className="footer-button bg-primary-stroke text-white text-xl font-bold py-2 px-4 rounded-full"
                        onClick={sendMsg}
>
                    
                        Send
                    </button>
                </div>
                </div>

                <UsersList users={convo.participants} active={!isPrivate} header={"All Users"}/>

            </div>
            </>
            }</>
    )
}

export default ChatRoom