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

  // useEffect(()=>{
  //   if(!socket)return ;
  //   const onUpdated = () => load();
  //   socket.on("recent-chat-updated",onUpdated);
  //   return () => socket.off("recent-chat-updated",onUpdated);
  // },[socket]);

  useEffect(()=>{
  if(!socket)return ;
  
  const onUpdated = (data) => {
    // Instead of reloading all, update just the changed room
    setRecent((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(r => r.roomId === data.roomId);
      
      if (index !== -1) {
        // Update existing room
        updated[index] = {
          ...updated[index],
          lastMessage: {
            content: data.lastMessage.content,
            time: data.lastMessage.time,
            sender: data.lastMessage.sender,
          },
          lastMessageTime: data.lastMessage.time,
        };
        // Move to top (most recent)
        const [moved] = updated.splice(index, 1);
        return [moved, ...updated];
      } else {
        // New room - reload to get full data
        load();
        return prev;
      }
    });
  };
  
  socket.on("recent-chat-updated", onUpdated);
  return () => socket.off("recent-chat-updated", onUpdated);
},[socket]);




  return (
    <div
      // className="font-montserrat-regular sm:w-full border-r border-black bg-gray-100 sm:h-[calc(100vh-7rem)] h-[100dvh] pt-20 pb-7 sm:pt-16 sm:pb-0 "
      // style={{
      //   maxHeight: "calc(100vh - 4rem)",
      //   overflowY: "auto",
      // }}

      className="font font-montserrat-regular w-full bg-gray-200 z-50 border-r border-black h-[calc(100dvh-100px)] pt-20 mt-24 sm:mt-0 sm:text-lg text-sm
  overflow-y-auto"
    >
      {recent.map((r) => (
        <div key={r.roomId} 
        className="sm:p-3 sm:pb-5 pb-5 pl-4 hover:bg-gray-200"
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








