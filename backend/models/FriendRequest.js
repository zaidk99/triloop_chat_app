import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

// preventing duplicates
friendRequestSchema.index(
  { from: 1, to: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

export default mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", friendRequestSchema);
