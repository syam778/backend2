import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    cardData:{type:Object,default:{}}
    
},{minimize:false})
const userModel = mongoose.models.user || mongoose.model("user",userSchema);


export default userModel;
//unique:true
// mobile:{type:Number,require:true},