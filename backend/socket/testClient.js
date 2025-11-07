import { io } from "socket.io-client";

const socket = io("http://localhost:5050",{
    withCredentials: true,
});

const ROOM_ID = "6874fed31603415f4b655ec8";
const USER_ID = "6874fbd4d2bc71fb07a69c56";

socket.on("connect",()=>{
    console.log("connected with socketid:",socket.id);
    socket.emit("join-room",{
        roomId: ROOM_ID,
        userId: USER_ID
    });

    socket.emit("send-message",{
        roomId: ROOM_ID,
        userId: USER_ID,
        content: "hello for test client!",
    });
});

socket.on("receive-message", (msg) => {
  console.log("✅ Message received in client:", msg);
});

