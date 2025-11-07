import mongoose from "mongoose";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const projectUser = "_id fullName username";

export const sendFriendRequest = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ error: "Invalid receiverId" });
  }
  if (senderId === receiverId) {
    return res.status(400).json({ error: "cannot send request to self" });
  }

  const [sender, reciever] = await Promise.all([
    User.findById(senderId).select("_id friends"),
    User.findById(receiverId).select("_id friends"),
  ]);
  if (!reciever) return res.status(404).json({ error: "User not found" });
  const alreadyFriends =
    sender.friends.some((id) => id.equals(receiverId)) ||
    reciever.friends.some((id) => id.equals(senderId));
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

//post /api/friends/respong accept / reject :

export const respondToFriendRequest = async (req, res) => {
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

  if (action === "reject") {
    await FriendRequest.deleteOne({ _id: request._id });
    return res.status(200).json({ message: "Rejected" });
  }

  // accept:add both to eacht others friends

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

  return res.status(200).json({
    message: "Accepted",
    friendId: request.from.toString(),
  });
};

// post /api/firends/cancel/:requestId (sender withdraws the request)

export const cancelFriendRequest = async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.params;

  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({ error: "Request not found" });
  }

  if (!request.from.equals(userId)) {
    return res.status(403).json({ error: "Not authorized to cancel" });
  }

  await FriendRequest.deleteOne({ _id: request._id });
  return res.status(200).json({ message: "Cancelled" });
};

//get friend requests incoming + outgoing pending
export const getFriendRequests = async (req,res)=>{
    const userId = req.userId;
    const [incoming , outgoing] = await Promise.all([
        FriendRequest.find({to:userId , status:"pending"})
         .populate("from",projectUser)
         .select("_id from to status createdAt"),
        FriendRequest.find({from: userId , status: "pending"})
         .populate("to" , projectUser)
         .select("_id from to status createdAt"),
    ]);

    res.status(200).json({
        incoming: incoming.map((r)=>({
            id:r._id.toString(),
            from:r.from &&{_id:r.from._id, fullName: r.from.fullName , username:r.from.username},
            createdAt:r.createdAt,
            status:r.status,
        })),

        outgoing: outgoing.map((r)=>({
            id:r._id.toString(),
            to:r.to&&{_id:r.to._id, fullName: r.to.fullName , username: r.to.username},
            createdAt:r.createdAt,
            status:r.status,
        })),
    });
};

// Get /api/friends/list
export const getFriends = async (req,res)=>{
    const userId = req.userId;
    const me = await User.findById(userId).populate("friends",projectUser).select("friends");
    const friends = (me?.friends || []).map((u)=>({
        _id: u._id,
        fullName : u.fullName,
        username: u.username,
    }));
    res.status(200).json({friends});
};

// get /api/users/searchUsers 

export const searchUsers = async (req,res)=>{
    const userId = req.userId;
    const q = (req.query.q || "").trim();
    if(!q) return res.status(200).json({results:[]});

    const users = await User.find({
        _id: {$ne:userId},
        $or: [
            {username: {$regex: q,$options: "i"} },
            {fullName: {$regex: q, $options:"i"} },
        ],
    })
    .select(projectUser)
    .limit(20);


    const [myDoc , pendingOutgoing ,pendingIncoming] = await Promise.all([
        User.findById(userId).select("friends"),
        FriendRequest.find({from:userId , status: "pending" }).select("to"),
        FriendRequest.find({to:userId, status:"pending"}).select("from"),
    ]);

    const friendSet = new Set((myDoc?.friends || []).map((id)=>id.toString()));
    const outgoingSet = new Set(pendingOutgoing.map((r)=>r.to.toString()));
    const incomingSet = new Set(pendingIncoming.map((r)=>r.from.toString()));

    const results = users.map((u)=>{
        let relation = "none";
        if(friendSet.has(u._id.toString())) relation = "friend";
        else if(outgoingSet.has(u._id.toString())) relation = "pending_outgoing";
        else if(incomingSet.has(u._id.toString())) relation = "pending_incoming";
        return {
            _id: u._id,
            fullName:u.fullName,
            username:u.username,
            relation,
        };
    });
    res.status(200).json({results});
}



