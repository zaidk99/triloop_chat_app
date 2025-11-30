import React, { useEffect, useState, useRef } from "react";
import ListHead from "./ListHead";
import ChatMainSidebar from "./ChatMainSidebar";
import Message from "./Message";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const { userId: otherUserId } = useParams();
  const socket = useSocket();
  const me = JSON.parse(localStorage.getItem("user"));
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);

  const isLoadingRef = useRef(false);

  useEffect(()=>{
    let mounted = true;

    const setUpChat = async ()=>{
      if(isLoadingRef.current) return ;
      isLoadingRef.current = true;

      try {
        const {data} = await axiosInstance.post("/messages/room/create",{
          otherUserId,
        });


        if(!mounted) return ;
        const room = data.room;
        setRoomId(room._id);


        const myId = me?.id || me?._id;
        const other = (room.participants || []).find(
          (p)=> String(p._id) !== String(myId)
        );
        if(other) setOtherUser(other);

        // join socket room
        if(socket){
          socket.emit("join-dm" , {otherUserId , userId : myId});
        }

        const history = await axiosInstance.get(`/messages/${room._id}`);
        if(!mounted) return ;
        setMessages(history.data.messages || []);
      } catch (error) {
          console.error("chat setup error : " , error);
          if(error.response?.status === 429){
            console.log("Rate limited , will retry automatically");
          }
      } finally {
        isLoadingRef.current = false;
      }
    };

    if(otherUserId && me?.id){
      setUpChat();
    }

    return ()=>{
      mounted = false;
      isLoadingRef.current = false;
    };
  }, [otherUserId , socket]);

  // listen for live messages

  useEffect(()=>{
    if(!socket || !roomId) return;

    const handleRecieve = (msg) => {
      if(msg.roomId === roomId){
        setMessages((prev)=>[...prev , msg]);
      }
    };

    socket.on("receive-message" , handleRecieve);
    return ()=>{
      socket.off("receive-message",handleRecieve);
    };
  },[socket,roomId]);


  // send message socket -->  fallback  http

  const sendMessage = async (text) => {
    if(!text?.trim() || !roomId) return ;
    const payload = {roomId , userId : me.id || me._id , content : text.trim()};

    let socketSent = false;
    try {
      if (socket && socket.connected){
        socket.emit("send-message",payload);
        socketSent = true;
      } 
    } catch {};

    if(!socketSent){
      try {
        // try now fallback http
        const {data} = await axiosInstance.post("/messages/send",{
          roomId,
          content: text.trim(),
        });
        setMessages((prev)=>[...prev,data.message]);
      } catch (error) {
        console.error("Failed to send message : " , error);
      }
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  return (
    <div className="flex h-screen">
      <ChatMainSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Message setIsSidebarOpen={setIsSidebarOpen} 
        messages={messages}
        onSend = {sendMessage}
        otherUser = {otherUser}
        roomId = {roomId}
      />
    </div>
  );
};

export default Chat;
