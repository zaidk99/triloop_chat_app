import {createContext , useContext , useEffect , useRef } from "react";
import {io} from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = ()=> useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = useRef();

    useEffect(()=>{
        socket.current = io(import.meta.env.VITE_SOCKET_URL , {
            withCredentials : true,
        });
        return () =>{
        socket.current.disconnect();
    };

    } , []);

   return (
    <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
   );
};

