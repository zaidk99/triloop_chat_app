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

// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import {useSelector} from 'react-redux';


// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const user = useSelector((state)=>state.auth.user);

//   useEffect(() => {
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", ()=> {
//       console.log("socket connected in SCT : " , s.id);
//       if(user?._id){
//         s.emit("user-connect",user._id);
//         console.log(`Connected user SCT ${user._id} to Socket`);
//       }
//     });

//     setSocket(s);


//     return () => {
//       s.disconnect();
//     };
//   }, [user?._id]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
  
//   // 🔴 FIX: Add safe access with optional chaining
//   const auth = useSelector((state) => state.auth);
//   const user = auth?.user;

//   useEffect(() => {
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", () => {
//       console.log("socket connected in SCT : ", s.id);
      
//       // 🔴 FIX: Check if user exists before emitting
//       if (user?._id) {
//         s.emit("user-connect", user._id);
//         console.log(`Connected user SCT ${user._id} to Socket`);
//       }
//     });

//     setSocket(s);

//     return () => {
//       s.disconnect();
//     };
//   }, [user?._id]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [userConnected, setUserConnected] = useState(false); // 🔴 ADD THIS
  
//   const auth = useSelector((state) => state.auth);
//   const user = auth?.user;

//   // 🔴 FIRST EFFECT: CREATE SOCKET CONNECTION
//   useEffect(() => {
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", () => {
//       console.log("✅ Socket connected:", s.id);
//       setSocket(s);
//     });

//     return () => {
//       s.disconnect();
//     };
//   }, []); // Empty dependency - only create socket once

//   // 🔴 SECOND EFFECT: EMIT USER-CONNECT WHEN USER IS READY
//   useEffect(() => {
//     if (!socket || !user?._id || userConnected) return; // Skip if not ready

//     console.log(`🔴 Emitting user-connect with userId: ${user._id}`);
//     socket.emit("user-connect", user._id);
//     setUserConnected(true);
//   }, [socket, user?._id, userConnected]); // React to socket & user changes

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [userConnected, setUserConnected] = useState(false);
  
//   const auth = useSelector((state) => state.auth);
//   const user = auth?.user;

//   console.log("🔵 SocketProvider render - user:", user?._id, "auth:", !!auth);

//   // 🔴 FIRST EFFECT: CREATE SOCKET CONNECTION (only once)
//   useEffect(() => {
//     console.log("📡 Creating socket connection...");
    
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", () => {
//       console.log("✅ Socket CONNECTED with ID:", s.id);
//       setSocket(s);
//     });

//     s.on("connect_error", (error) => {
//       console.error("❌ Socket connection error:", error);
//     });

//     return () => {
//       console.log("🔌 Disconnecting socket...");
//       s.disconnect();
//     };
//   }, []); // Empty - only run once

//   // 🔴 SECOND EFFECT: EMIT USER-CONNECT WHEN BOTH SOCKET AND USER ARE READY
//   useEffect(() => {
//     console.log("🔍 Checking user-connect conditions:");
//     console.log("  - socket:", !!socket);
//     console.log("  - user._id:", user?._id);
//     console.log("  - userConnected:", userConnected);

//     if (!socket) {
//       console.log("  ⏳ Waiting for socket...");
//       return;
//     }

//     if (!user?._id) {
//       console.log("  ⏳ Waiting for user...");
//       return;
//     }

//     if (userConnected) {
//       console.log("  ✅ Already connected");
//       return;
//     }

//     // 🔴 EMIT USER-CONNECT
//     console.log(`🚀 Emitting user-connect with userId: ${user._id}`);
//     socket.emit("user-connect", user._id);
//     setUserConnected(true);
//     console.log(`✅ user-connect emitted for user: ${user._id}`);

//   }, [socket, user?._id, userConnected]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };


// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [userConnected, setUserConnected] = useState(false);
  
//   const auth = useSelector((state) => state.auth);
//   let user = auth?.user;

//   // 🔴 FALLBACK: Load from localStorage if Redux doesn't have it
//   if (!user) {
//     try {
//       const storedAuth = localStorage.getItem('auth');
//       if (storedAuth) {
//         const authData = JSON.parse(storedAuth);
//         user = authData.user;
//         console.log("📦 Loaded user from localStorage:", user?._id);
//       }
//     } catch (err) {
//       console.error("Error loading from localStorage:", err);
//     }
//   }

//   console.log("🔵 SocketProvider - user:", user?._id);

//   useEffect(() => {
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", () => {
//       console.log("✅ Socket CONNECTED:", s.id);
//       setSocket(s);
//     });

//     return () => s.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!socket || !user?._id || userConnected) return;

//     console.log(`🚀 Emitting user-connect: ${user._id}`);
//     socket.emit("user-connect", user._id);
//     setUserConnected(true);

//   }, [socket, user?._id, userConnected]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [userConnected, setUserConnected] = useState(false);
  
//   const auth = useSelector((state) => state.auth);
//   let user = auth?.user;

//   // 🔴 DEBUGGING: Check ALL storage options
//   useEffect(() => {
//     console.log("🔍 DEBUGGING AUTH STORAGE:");
//     console.log("  Redux auth:", auth);
//     console.log("  Redux user:", user?._id);

//     // Check localStorage
//     console.log("\n📦 LocalStorage Contents:");
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       console.log(`  ${key}:`, value?.substring(0, 100) + "...");
//     }

//     // Check sessionStorage
//     console.log("\n📦 SessionStorage Contents:");
//     for (let i = 0; i < sessionStorage.length; i++) {
//       const key = sessionStorage.key(i);
//       const value = sessionStorage.getItem(key);
//       console.log(`  ${key}:`, value?.substring(0, 100) + "...");
//     }

//     // Try different key names
//     const possibleKeys = ['auth', 'user', 'token', 'authToken', '_auth', 'currentUser'];
//     console.log("\n🔑 Checking possible auth keys:");
//     possibleKeys.forEach(key => {
//       const stored = localStorage.getItem(key) || sessionStorage.getItem(key);
//       if (stored) {
//         console.log(`  ✅ Found '${key}':`, stored?.substring(0, 150));
//       }
//     });

//   }, []);

//   // Try multiple ways to get user
//   if (!user) {
//     // Try localStorage with different keys
//     const storageKeys = ['auth', 'user', 'currentUser', '_auth'];
//     for (const key of storageKeys) {
//       try {
//         const stored = localStorage.getItem(key) || sessionStorage.getItem(key);
//         if (stored) {
//           const data = JSON.parse(stored);
//           console.log(`📦 Loaded from '${key}':`, data);
          
//           // Try different data structures
//           if (data.user) user = data.user;
//           else if (data._id) user = data;
//           else if (data.data?.user) user = data.data.user;
          
//           if (user?._id) {
//             console.log(`✅ Extracted user from '${key}':`, user._id);
//             break;
//           }
//         }
//       } catch (err) {
//         console.error(`Error parsing '${key}':`, err);
//       }
//     }
//   }

//   console.log("🔵 SocketProvider - Final user:", user?._id);

//   useEffect(() => {
//     const s = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//     });

//     s.on("connect", () => {
//       console.log("✅ Socket CONNECTED:", s.id);
//       setSocket(s);
//     });

//     s.on("connect_error", (error) => {
//       console.error("❌ Socket error:", error);
//     });

//     return () => s.disconnect();
//   }, []);

//   useEffect(() => {
//     console.log("⚙️ User-connect check:", { 
//       socket: !!socket, 
//       userId: user?._id, 
//       userConnected 
//     });

//     if (!socket || !user?._id || userConnected) return;

//     console.log(`🚀 Emitting user-connect: ${user._id}`);
//     socket.emit("user-connect", user._id);
//     setUserConnected(true);

//   }, [socket, user?._id, userConnected]);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };



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
