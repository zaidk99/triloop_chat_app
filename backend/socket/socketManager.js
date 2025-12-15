import Message from "../models/Messages.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { getOrCreateDMRoom } from "../controllers/messageController.js";
import * as trieService from "../services/trieService.js";

export const socketManager = (io)=>{
  io.on("connection",(socket)=>{
    console.log("User Connected :" , socket.id);

    socket.on("join-room", async ({roomId , userId})=> {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      socket.to(roomId).emit("user-joined" , {userId , socketId : socket.id});
    });

    // socket.on("join-dm",async ({otherUserId , userId})=>{
    //   try {
    //     const room = await getOrCreateDMRoom(userId , otherUserId);
    //     const roomId = room._id.toString();

    //     socket.join(roomId);
    //     console.log(`User ${userId} Joined Dm room ${roomId} with ${otherUserId}`);

    //     socket.to(roomId).emit("user-joined-dm",{
    //       userId,
    //       roomId,
    //       room: room
    //     });
    //   } catch (error) {
    //     console.error("error joining the DM : " , error);
    //     console.error("error",{message: "Failed to join DM ROOM"});
    //   }
    // });
    io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`Socket ${id} joined room ${room}`);
});

    socket.on("send-message",async({roomId,userId,content})=>{
      try {
        //create message 
        const messageDoc = await Message.create({
          room : roomId ,
          sender : userId ,
          content,
        });

        await trieService.insert(roomId,content);

        // update room last message info 

        await Room.updateOne(
          {_id: roomId},
          {
            lastMessage : messageDoc._id ,
            lastMessageTime : messageDoc.createdAt
          }
        );

        // get user data
        const user = await User.findById(userId).select("username fullName _id");

        const populated = await Message.findById(messageDoc._id).populate(
          "sender" ,
          "_id fullName username" 
      );

      io.to(roomId).emit("receive-message" , {
        ...populated.toObject(),
        roomId,
      });

        // broadcast message to the room 

        io.to(roomId).emit("recent-chat-updated",{
          roomId,
          lastMessage:{
            content,
            time : messageDoc.createdAt,
            sender:userId,
          }
        });
      } catch (err) {
          console.error("Error Sending messages : " , err);
          socket.emit("error",{message:"failed to send messages"});
      }
    });

    socket.on("disconnect",()=>{
      console.log("User disconnected :" , socket.id);
    });
  })
}
