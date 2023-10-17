import mongoose from "mongoose";

const TaskSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required: true
    },
    progress:{
        type:Number,
        required:true
    },
    Date:{
        type:String,
        required:true
    }
},{timestamps:true})
const Task = mongoose.model('Task',TaskSchema)
export {Task}