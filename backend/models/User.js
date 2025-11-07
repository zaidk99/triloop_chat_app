import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        fullName: {
          type:String,
          required:true,
          trim:true
        },

        username : {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim: true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        friends:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        friendRequests:[
            {
                from: {type: mongoose.Schema.Types.ObjectId , ref:"User"},
                status:{
                    type:String,
                    enum:["pending","accepted","expired"],
                    default:"pending",
                },
                createdAt:{type:Date,default:Date.now},
            },
        ],
    },
    {timestamps:true}
);



export default mongoose.models.User || mongoose.model("User",userSchema);
