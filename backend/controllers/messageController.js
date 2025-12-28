import mongoose from "mongoose";
import Message from "../models/Messages.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import * as trieService from "../services/trieService.js";
import { tokenize } from "../utils/tokenize.js";

export const getOrCreateDMRoom = async (userId1, userId2) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId1) ||
    !mongoose.Types.ObjectId.isValid(userId2)
  ) {
    throw new Error("Inavlid user ID'S ");
  }
  if (String(userId1) === String(userId2)) {
    throw new Error("Cannot create Dm with self");
  }

  // sorting participants consistently to avoid duplicates
  const participants = [userId1, userId2].sort();

  //find existing DM ROOM
  let room = await Room.findOne({
    isDM: true,
    participants: { $all: participants },
  }).populate("participants", "_id fullName username");

  if (!room) {
    try {
      const sortedName = `DM_${participants[0]}_${participants[1]}`;
      room = await Room.create({
        name: sortedName,
        type: "dm",
        isDM: true,
        participants: participants,
      });

      // room = await Room.findOne(room._id).populate(
      //   "participants",
      //   "_id fullName username"
      // );

      room = await Room.findById(room._id).populate(
        "participants",
        "_id fullName username"
      );
    } catch (error) {
      // if creation fails due to duplicates try find it again
      if (error?.code === 11000) {
        room = await Room.findOne({
          isDM: true,
          participants: { $all: participants },
        }).populate("participants", "_id  fullName  username");

        if (!room) {
          throw new Error("Failed to find or create DM room");
        }
      } else {
        throw error;
      }
    }
  }

  return room;
};

// Getting users recent chats GET /api/messages/recent

export const getRecentChats = async (req, res) => {
  try {
    const userId = req.userId;

    // finding all dm where users is the participant
    const dmRooms = await Room.find({
      isDM: true,
      participants: userId,
    })
      .populate("participants", "_id fullName username")
      .populate("lastMessage")
      .sort({ lastMessageTime: -1 });

    // convert data for frontend use
    const recentChats = dmRooms.map((room) => {
      // Get other participants
      const otherParticipants = room.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );

      return {
        roomId: room._id,
        otherUser: {
          _id: otherParticipants._id,
          fullName: otherParticipants.fullName,
          username: otherParticipants.username,
        },
        lastMessage: room.lastMessage
          ? {
              content: room.lastMessage.content,
              time: room.lastMessage.createdAt,
              sender: room.lastMessage.sender,
            }
          : null,
        lastMessageTime: room.lastMessageTime,
      };
    });
    res.status(200).json({ recentChats });
  } catch (error) {
    console.error("Error Fetching recent chats : ", error);
    res.status(500).json({ error: "Failed to fetch recent chats" });
  }
};

// Get /api/messages/:roomId
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    // verifying if the user is the participant in this room
    const room = await Room.findOne({
      _id: roomId,
      participants: userId,
    });

    if (!room) {
      return res.status(403).json({ error: "Access Denied" });
    }

    // get messages for this room
    const messages = await Message.find({ room: roomId })
      .populate("sender", "_id fullName username")
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("specific room messages not found ", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Post /api/messages/send
export const sendMessage = async (req, res, io) => {
  try {
    const { roomId, content } = req.body;
    const senderId = req.userId;

    //verifying if user is participant in this room
    const room = await Room.findOne({
      _id: roomId,
      participants: senderId,
    });

    if (!room) {
      return res.status(403).json({ error: "Access Denied" });
    }

    // create message
    const message = await Message.create({
      room: roomId,
      sender: senderId,
      content,
    });

    //Trie for prredictions
    await trieService.insert(roomId, content);

    // update room's last message info
    await Room.updateOne(
      { _id: roomId },
      {
        lastMessage: message._id,
        lastMessageTime: message.createdAt,
      }
    );

    // now for response populate message
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "_id fullName username"
    );
    console.log("about to emit socket");
    if (io) {
      try {
        io.to(roomId.toString()).emit("receive-message", {
          ...populatedMessage.toObject(),
          roomId: roomId.toString(),
        });

        io.to(roomId.toString()).emit("recent-chat-updated", {
          roomId: roomId.toString(),
          lastMessage: {
            content,
            time: message.createdAt,
            sender: senderId,
          },
        });
      } catch (socketError) {
        console.error("Socket emission error : ", socketError);
      }
    }
    console.log("about to send response HTTP");
    return res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Error sending message :", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const predictNextWords = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { prefix } = req.query;
    const userId = req.userId;

    if (!prefix || prefix.trim() === "") {
      return res.status(200).json({ suggestions: [] });
    }

    const room = await Room.findOne({
      _id: roomId,
      participants: userId,
    });

    if (!room) {
      return res.status(403).json({ error: "Access Denied" });
    }

    // tokenize prefix text
    const prefixTokens = tokenize(prefix);

    if (prefixTokens.length === 0) {
      return res.status(200).json({ suggestions: [] });
    }

    const trie = await trieService.loadTrie(roomId);

    const suggestions = trie.predict(prefixTokens).slice(0, 3);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Prediction Error ", error);
    res.status(500).json({ error: "Failed to predict next words" });
  }
};
