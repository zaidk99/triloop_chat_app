import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import axiosInstance from "../utils/axiosInstance";


const RecentChatList = () => {
  const [recent , setRecent] = useState([]);
  const navigate = useNavigate();
  const socket = useSocket();
  const me = JSON.parse(localStorage.getItem("user"));

  const load = async ()=>{
    const {data} = await axiosInstance.get("/messages/recent");
    setRecent(data.recentChats || []);
  };

  useEffect(()=>{
    load();
  },[]);

  useEffect(()=>{
    if(!socket)return ;
    const onUpdated = () => load();
    socket.on("recent-chat-updated",onUpdated);
    return () => socket.off("recent-chat-updated",onUpdated);
  },[socket]);


  return (
    <div
      className="font-montserrat-regular sm:w-full border-r border-gray-100 bg-gray-100 sm:h-[calc(100vh-11rem)] pt-[7rem] pb-7 sm:pt-0 sm:pb-0   "
      style={{
        maxHeight: "calc(100vh - 4rem)",
        overflowY: "auto",
      }}
    >
      {recent.map((r) => (
        <div key={r.roomId} 
        className="sm:p-3 pb-3 pl-4 hover:bg-gray-200"
        onClick={()=>navigate(`/chat/${r.otherUser._id}`)}
        >
          <span className="font-bold">@{r.otherUser.username}</span>
          <div className="pt-2">
            <p className="font-light">
              {r.lastMessage?.content || "Start Conversation"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentChatList;








