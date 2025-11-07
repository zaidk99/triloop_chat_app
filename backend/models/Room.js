import { mongoose } from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
           
        },
        type:{
            type:String,
            enum:["public","dm"],
            default:"dm",
        },
        isDM: {
            type:Boolean,
            default:false,
        },
        participants:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
            },
        ],
        lastMessage : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        },
        lastMessageTime:{
            type:Date,
        },
    },
    {timestamps : true}
);

roomSchema.index(
    {participants: 1 , isDM:1},
    {unique:true , partialFilterExpression : {isDM : true , participants : {$size: 2}}}
);

roomSchema.pre('save',function(next){
    if(this.isDM && this.participants.length !==2 ){
        return next(new Error('Direct Message Rooms must have exactly 2 Participants'));
    }
    next();
});

export default mongoose.models.Room || mongoose.model("Room",roomSchema);