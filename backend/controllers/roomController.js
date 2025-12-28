import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const existing = await Room.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Room already exists" });
    const room = await Room.create({
      name,
      isPrivate,
      participants: [req.userId],
    });
    res.status(201).json({ message: "Room created", room });
  } catch (err) {
    console.error("Error creating room ", err);
    res.status(500).json({ message: "Failed to create room " });
  }
};

export const getAllrooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false });
    res.status(200).json({ rooms });
  } catch (err) {
    console.error("Error Fetching rooms : ", err);
    res.status(500).json({ message: "Error fetching all rooms" });
  }
};
