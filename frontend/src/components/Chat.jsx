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

  const currentRoomIdRef = useRef(null);

  useEffect(() => {
    currentRoomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    let mounted = true;

    const setUpChat = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        const { data } = await axiosInstance.post("/messages/room/create", {
          otherUserId,
        });

        if (!mounted) return;
        const room = data.room;
        setRoomId(room._id);

        const myId = me?.id || me?._id;
        const other = (room.participants || []).find(
          (p) => String(p._id) !== String(myId)
        );
        if (other) setOtherUser(other);
        const history = await axiosInstance.get(`/messages/${room._id}`);
        if (!mounted) return;
        setMessages(history.data.messages || []);
      } catch (error) {
        console.error("chat setup error : ", error);
        if (error.response?.status === 429) {
          console.log("Rate limited , will retry automatically");
        }
      } finally {
        isLoadingRef.current = false;
      }
    };

    if (otherUserId && me?.id) {
      setUpChat();
    }

    return () => {
      mounted = false;
      isLoadingRef.current = false;
    };
  }, [otherUserId]);




  useEffect(() => {
    if (!socket || !roomId) return;

    const myId = me?.id || me?._id;

    if (socket.connected) {
      socket.emit("join-room", { roomId, userId: myId });
    } else {
      socket.once("connect", () => {
        socket.emit("join-room", { roomId, userId: myId });
      });
    }
  }, [socket, roomId  ]);

  // listen for live messages

  useEffect(() => {
    if (!socket) return;

    const handleRecieve = (msg) => {
      if (msg.roomId === currentRoomIdRef.current) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m._id === msg._id ||
              (m._id?.startsWith("temp-") &&
                m.content === msg.content &&
                m.sender?._id === msg.sender?._id)
          );

          if (exists) {
            return prev.map((m) =>
              m._id?.startsWith("temp-") && m.content === msg.content ? msg : m
            );
          }
          return [...prev, msg];
        });
      }
    };

    socket.on("receive-message", handleRecieve);
    return () => {
      socket.off("receive-message", handleRecieve);
    };
  }, [socket]);

  // send message socket -->  fallback  http

  const sendMessage = async (text) => {
    if (!text?.trim() || !roomId) return;
    const payload = { roomId, userId: me.id || me._id, content: text.trim() };

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      content: text.trim(),
      sender: {
        _id: me.id || me._id,
        fullName: me.fullName,
        username: me.username,
      },
      roomId: roomId,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    let socketSent = false;
    try {
      if (socket && socket.connected) {
        socket.emit("send-message", payload);
        socketSent = true;
      }
    } catch {}

    if (!socketSent) {
      try {
        // try now fallback http
        const { data } = await axiosInstance.post("/messages/send", {
          roomId,
          content: text.trim(),
        });
        setMessages((prev) =>
          prev.filter((m) => !m._id.startsWith("temp-")).concat([data.message])
        );
      } catch (error) {
        setMessages((prev) => prev.filter((m) => !m._id.startsWith("temp-")));
        console.error("Failed to send message : ", error);
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
      <Message
        setIsSidebarOpen={setIsSidebarOpen}
        messages={messages}
        onSend={sendMessage}
        otherUser={otherUser}
        roomId={roomId}
      />
    </div>
  );
};

export default Chat;
