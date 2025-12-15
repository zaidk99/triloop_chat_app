// import {createContext , useContext , useEffect , useRef } from "react";
// import {io} from "socket.io-client";

// const SocketContext = createContext(null);

// export const useSocket = ()=> useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//     const socket = useRef();

//     useEffect(()=>{
//         socket.current = io(import.meta.env.VITE_SOCKET_URL , {
//             withCredentials : true,
//         });
//         return () =>{
//         socket.current.disconnect();
//     };

//     } , []);

//    return (
//     <SocketContext.Provider value={socket.current}>
//         {children}
//     </SocketContext.Provider>
//    );
// };

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};