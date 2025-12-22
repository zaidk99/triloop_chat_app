import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userConnected, setUserConnected] = useState(false);
  
  const auth = useSelector((state) => state.auth);
  let user = auth?.user;

  // 🔴 Load from localStorage if Redux doesn't have it
  if (!user) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
        console.log("✅ Loaded user from localStorage:", user);
      }
    } catch (err) {
      console.error("Error loading user from localStorage:", err);
    }
  }

  // 🔴 Handle both "id" and "_id" (MongoDB uses _id, but your API returns "id")
  const userId = user?._id || user?.id;
  
  console.log("🔵 SocketProvider - userId:", userId);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    s.on("connect", () => {
      console.log("✅ Socket CONNECTED:", s.id);
      setSocket(s);
    });

    s.on("connect_error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    console.log("⚙️ User-connect check:", { 
      socket: !!socket, 
      userId, 
      userConnected 
    });

    if (!socket || !userId || userConnected) return;

    console.log(`🚀 Emitting user-connect: ${userId}`);
    socket.emit("user-connect", userId);
    setUserConnected(true);

  }, [socket, userId, userConnected]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
