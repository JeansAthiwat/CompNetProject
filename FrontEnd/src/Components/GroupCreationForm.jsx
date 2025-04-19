import axios from "axios"
import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../Contexts/SocketContext"

const GroupCreationForm = () => {
    const groupNameRef = useRef()
    const navigate = useNavigate()
    const { socket } = useSocket()

    const handleSubmit = async (e) => {
        e.preventDefault()
        // console.log(groupNameRef.current.value)
        try {
            const response = await axios.post("http://localhost:39189/conversation/group", {
                groupName:groupNameRef.current.value
            }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
            // console.log(response.data)
            const conv = response.data.conv
            socket.emit('new group', null)
            navigate("/chat", { state: { isPrivate:conv.is_private, to:conv._id, roomName:conv.name } })
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label className="text-2xl font-bold">Group name</label>
            <input defaultValue="Back Bender" ref={groupNameRef} className="bg-white" />
            <button className="bg-primary-stroke px-2 py-2 rounded-full text-white font-bold">Create</button>
        </form>
    )
}

export default GroupCreationForm