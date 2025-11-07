import { mongoose } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required:true,
    },
    content: {
      type: String,
      required: true,
    },
    type:{
      type:String,
      enum:["text","image","file"],
      default:"text",
    },
  },
  { timestamps: true }
);



export default  mongoose.models.Message || mongoose.model("Message",messageSchema);