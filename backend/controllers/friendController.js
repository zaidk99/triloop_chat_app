import mongoose from "mongoose";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const projectUser = "_id fullName username";

export const sendFriendRequest = async (req, res, io) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ error: "Invalid receiverId" });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ error: "cannot send request to self" });
  }

  const [sender, receiver] = await Promise.all([
    User.findById(senderId).select("_id friends fullName username"),
    User.findById(receiverId).select("_id friends"),
  ]);

  if (!receiver) return res.status(404).json({ error: "User not found" });

  const alreadyFriends =
    sender.friends.some((id) => id.equals(receiverId)) ||
    receiver.friends.some((id) => id.equals(senderId));

  if (alreadyFriends) {
    return res.status(409).json({ error: "Already friends" });
  }

  const exists = await FriendRequest.exists({
    $or: [
      { from: senderId, to: receiverId, status: "pending" },
      { from: receiverId, to: senderId, status: "pending" },
    ],
  });

  if (exists) {
    return res.status(409).json({ error: "Request already pending" });
  }

  const request = await FriendRequest.create({
    from: senderId,
    to: receiverId,
    status: "pending",
  });

  console.log(`Emitting friend:request-received to user:${receiverId}`);
  io.to(`user:${receiverId}`).emit("friend:request-received", {
    requestId: request._id.toString(),
    from: {
      _id: sender._id.toString(),
      fullName: sender.fullName,
      username: sender.username,
    },
    status: "pending",
    createdAt: request.createdAt,
  });

  return res.status(201).json({
    message: "Request sent",
    request: {
      id: request._id.toString(),
      from: senderId,
      to: receiverId,
      status: "pending",
    },
  });
};

// RESPOND TO FRIEND REQUEST
export const respondToFriendRequest = async (req, res, io) => {
  const userId = req.userId;
  const { requestId } = req.params;
  const { action } = req.body;

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({ error: "Request not found" });
  }

  if (!request.to.equals(userId)) {
    return res.status(403).json({ error: "Not authorised to respond" });
  }

  // REJECT CASE
  if (action === "reject") {
    try {
      await FriendRequest.deleteOne({ _id: request._id });

      // EMIT REJECTION TO SENDER
      console.log(`Emitting friend:request-rejected to user:${request.from}`);
      io.to(`user:${request.from}`).emit("friend:request-rejected", {
        requestId: request._id.toString(),
      });

      return res.status(200).json({ message: "Rejected" });
    } catch (err) {
      console.error("Error rejecting request:", err);
      return res.status(500).json({ error: "Failed to reject request" });
    }
  }

  // ACCEPT CASE
  try {
    await Promise.all([
      User.updateOne(
        { _id: request.from, friends: { $ne: request.to } },
        { $addToSet: { friends: request.to } }
      ),
      User.updateOne(
        { _id: request.to, friends: { $ne: request.from } },
        { $addToSet: { friends: request.from } }
      ),
      FriendRequest.deleteOne({ _id: request._id }),
    ]);

    // Get accepted friend info
    const acceptedFriend = await User.findById(request.from).select(
      "_id fullName username"
    );

    console.log(`Emitting friend:request-accepted to user:${request.from}`);
    io.to(`user:${request.from}`).emit("friend:request-accepted", {
      requestId: request._id.toString(),
      friendId: acceptedFriend._id.toString(),
      friend: {
        _id: acceptedFriend._id.toString(),
        fullName: acceptedFriend.fullName,
        username: acceptedFriend.username,
      },
    });

    return res.status(200).json({
      message: "Accepted",
      friendId: request.from.toString(),
    });
  } catch (err) {
    console.error("Error accepting request:", err);
    return res.status(500).json({ error: "Failed to accept request" });
  }
};

// CANCEL FRIEND REQUEST
export const cancelFriendRequest = async (req, res, io) => {
  const userId = req.userId;
  const { requestId } = req.params;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(404).json({ error: "Request not found" });
    }

    if (!request.from.equals(userId)) {
      return res.status(403).json({ error: "Not authorized to cancel" });
    }

    await FriendRequest.deleteOne({ _id: request._id });

    //  EMIT CANCELLATION TO RECEIVER
    console.log(`Emitting friend:request-cancelled to user:${request.to}`);
    io.to(`user:${request.to}`).emit("friend:request-cancelled", {
      requestId: request._id.toString(),
    });

    return res.status(200).json({ message: "Cancelled" });
  } catch (err) {
    console.error("Error cancelling request:", err);
    return res.status(500).json({ error: "Failed to cancel request" });
  }
};

// GET FRIEND REQUESTS
export const getFriendRequests = async (req, res) => {
  const userId = req.userId;

  try {
    const [incoming, outgoing] = await Promise.all([
      FriendRequest.find({ to: userId, status: "pending" })
        .populate("from", projectUser)
        .select("_id from to status createdAt"),
      FriendRequest.find({ from: userId, status: "pending" })
        .populate("to", projectUser)
        .select("_id from to status createdAt"),
    ]);

    res.status(200).json({
      incoming: incoming.map((r) => ({
        id: r._id.toString(),
        from: r.from && {
          _id: r.from._id,
          fullName: r.from.fullName,
          username: r.from.username,
        },
        createdAt: r.createdAt,
        status: r.status,
      })),

      outgoing: outgoing.map((r) => ({
        id: r._id.toString(),
        to: r.to && {
          _id: r.to._id,
          fullName: r.to.fullName,
          username: r.to.username,
        },
        createdAt: r.createdAt,
        status: r.status,
      })),
    });
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ error: "Failed to fetch friend requests" });
  }
};

// GET FRIENDS LIST
export const getFriends = async (req, res) => {
  const userId = req.userId;

  try {
    const me = await User.findById(userId)
      .populate("friends", projectUser)
      .select("friends");

    const friends = (me?.friends || []).map((u) => ({
      _id: u._id,
      fullName: u.fullName,
      username: u.username,
    }));

    res.status(200).json({ friends });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

// SEARCH USERS
export const searchUsers = async (req, res) => {
  const userId = req.userId;
  const q = (req.query.q || "").trim();

  if (!q) return res.status(200).json({ results: [] });

  try {
    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { username: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
    })
      .select(projectUser)
      .limit(20);

    const [myDoc, pendingOutgoing, pendingIncoming] = await Promise.all([
      User.findById(userId).select("friends"),
      FriendRequest.find({ from: userId, status: "pending" }).select("to"),
      FriendRequest.find({ to: userId, status: "pending" }).select("from"),
    ]);

    const friendSet = new Set(
      (myDoc?.friends || []).map((id) => id.toString())
    );
    const outgoingSet = new Set(pendingOutgoing.map((r) => r.to.toString()));
    const incomingSet = new Set(pendingIncoming.map((r) => r.from.toString()));

    const results = users.map((u) => {
      let relation = "none";
      if (friendSet.has(u._id.toString())) relation = "friend";
      else if (outgoingSet.has(u._id.toString())) relation = "pending_outgoing";
      else if (incomingSet.has(u._id.toString())) relation = "pending_incoming";
      return {
        _id: u._id,
        fullName: u.fullName,
        username: u.username,
        relation,
      };
    });

    res.status(200).json({ results });
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
};
