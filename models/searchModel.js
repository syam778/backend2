import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,require:true},
    image:{type:String,require:true}
    
    
},)
const searchModel = mongoose.models.user || mongoose.model("user",userSchema);


export default searchModel;