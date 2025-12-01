import { io } from "socket.io-client";

const socket = io("http://localhost....",{
    withCredentials: true,
});

const ROOM_ID = "......";
const USER_ID = ".....";

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

