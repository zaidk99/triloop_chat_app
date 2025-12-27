import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { tokenUtils } from "../utils/tokenUtils";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userConnected, setUserConnected] = useState(false);

  const auth = useSelector((state) => state.auth);
  let user = auth?.user;

  // if (!user) {
  //   try {
  //     const storedUser = localStorage.getItem('user');
  //     if (storedUser) {
  //       user = JSON.parse(storedUser);
  //     }
  //   } catch (err) {
  //     console.error("Error loading user from localStorage:", err);
  //   }
  // }

  if (!user) {
    user = tokenUtils.getUser();
  }

  const userId = user?._id || user?.id;

  // useEffect(() => {
  //   const s = io(import.meta.env.VITE_SOCKET_URL, {
  //     withCredentials: true,
  //   });

  //   s.on("connect", () => {
  //     console.log("Socket CONNECTED:", s.id);
  //     setSocket(s);
  //   });

  //   s.on("connect_error", (error) => {
  //     console.error("Socket error:", error);
  //   });

  //   return () => s.disconnect();
  // }, []);

  useEffect(() => {
    const token = tokenUtils.getToken();
    if (!token) return;

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
    });

    s.on("connect", () => {
      console.log("socket connected : ", s.id);
      setSocket(s);
    });

    s.on("connect_error", (error) => {
      console.error("Socket Error ", error);
    });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !userId || userConnected) return;
    socket.emit("user-connect", userId);
    setUserConnected(true);
  }, [socket, userId, userConnected]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
