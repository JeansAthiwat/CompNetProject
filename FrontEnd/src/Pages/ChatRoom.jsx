import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"

const ChatRoom = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([{"sender":"anonymous user", "text": "ello"}])
    const inputRef = useRef()
    const chatBottomRef = useRef()

    useEffect(() => {
        chatBottomRef.current.scrollIntoView()
    }, [messages])

    const goBack = () => {
        navigate("/home")
    }

    const sendMsg = () => {
        const sender = sessionStorage.getItem("name") || "anonymous user"
        const text = inputRef.current.value
        setMessages([...messages, {sender, text}])
        inputRef.current.value = ""
        chatBottomRef.current.scrollIntoView()
    }

    return (
        <>
            <div className="chat-container flex flex-col h-[100vh]">
                <div className="chat-header flex border-primary-stroke border-b-2 font-bold text-3xl pt-4 pb-2 pl-15">
                    <button className="back-button" onClick={goBack}>←</button>
                    <h2 className="pl-2">Gooners (150)</h2>
                </div>

                <div className="chat-body w-[80vw] grow py-5 pl-15 overflow-y-scroll">
                    {
                        messages.map((msg,index) =>  
                            <div className="message-item relative flex items-end mt-3 mb-9" key={index}>
                                <div className="sender flex flex-col items-start mr-3 relative">
                                    {/* Sender name floating above */}
                                    <div className="pf-name absolute -top-6 left-0 text-lg font-semibold whitespace-nowrap">
                                    {msg.sender}
                                    </div>
                                    
                                    {/* Avatar */}
                                    <div className="pf-img w-[4rem] h-[4rem] bg-green-100 rounded-full mt-2"></div>
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
        </>
    )
}

export default ChatRoom