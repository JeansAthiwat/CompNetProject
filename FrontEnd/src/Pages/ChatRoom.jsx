import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { getSocket } from "../socket";

const ChatRoom = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const inputRef = useRef()
    const chatBottomRef = useRef()
    const location = useLocation();
    const { roomId } = location.state;  // userId passed via state
    const [socket, setSocket] = useState(null)
    const [roomData, setRoomData] = useState(null)

    console.log("Chat with user/room",{roomId})

    useEffect(() => {
        const getRoomData = async () => {
            const response = await fetch(`http://localhost:39189/api/user/${roomId}`)
            const data = await response.json()
            console.log("Roomdata:",data)
            setRoomData(data.user)
        }
        getRoomData()
    },[])

    useEffect(() => {
        const socketInstance = getSocket()
        setSocket(socketInstance)
        const handlePrivateMessage = ({sender, text}) => {
            if(sender.id === roomId) {
                console.log(text)
                setMessages(prev => [...prev, {sender:{name:sender.name, avatarIndex:sender.avatarIndex}, text}])
            }
        }
        socketInstance.on("private message", handlePrivateMessage)
        return () => {
            socketInstance.off("private message", handlePrivateMessage);
        };
    },[])

    useEffect(() => {
        if(roomData && messages)
            chatBottomRef.current.scrollIntoView()
    }, [messages])

    const goBack = () => {
        navigate("/home")
    }

    const sendMsg = () => {
        const senderName = sessionStorage.getItem("name") || "anonymous user"
        const text = inputRef.current.value
        console.log(sessionStorage.getItem("uid"))
        socket.emit("private message", {
            sender:sessionStorage.getItem("uid"),
            reciever:roomId,
            text
        })
        setMessages([...messages, {"sender":{"name":senderName, "avatarIndex":sessionStorage.getItem("avatarIndex")}, text}])
        inputRef.current.value = ""
        chatBottomRef.current.scrollIntoView()
    }

    return (
        <>
            {roomData &&
            <div className="chat-container flex flex-col h-[100vh]">
                <div className="chat-header flex border-primary-stroke border-b-2 font-bold text-3xl pt-4 pb-2 pl-15">
                    <button className="back-button" onClick={goBack}>←</button>
                    <h2 className="pl-2">{roomData.username}</h2>
                </div>

                <div className="chat-body w-[80vw] grow py-5 pr-5 pl-15 overflow-y-scroll scroll-smooth flex flex-col">
                    {
                        messages.map((msg,index) => 
                            msg.sender.name == sessionStorage.getItem("name") ?
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
                                    {msg.sender.name}
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
                    <input ref={inputRef} type="text" className="chat-input bg-secondary-bg py-2 px-4 rounded-2xl grow mx-2 text-xl font-bold" />
                    <button className="footer-button bg-primary-stroke text-white text-xl font-bold py-2 px-4 rounded-full"
                        onClick={sendMsg}>
                        Send
                    </button>
                </div>
            </div>
            }
        </>
    )
}

export default ChatRoom