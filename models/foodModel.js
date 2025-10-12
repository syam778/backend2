import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({
    name:{type:String,require:true},
    price:{type:Number,require:true},
    description:{type:String,require:true},
    image:{type:String,require:true},
    category:{type:String,require:true},
    firstName:{type:String,require:true},
    phone:{type:Number,require:true},
    street:{type:String,require:true},
    city:{type:String,require:true}
    
})
const foodModel = mongoose.models.food || mongoose.model("food",foodSchema);

export default foodModel;
/*
import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: Number,
        required: true
    },
    job: {
        type: String,
        required: true,
        enum: ['frontend', 'backend', 'fullstack', 'dataentry']
    }, salary: {
        type: Number,
        required: true

    }

});
const job = mongoose.model('job', jobSchema);
export default job;

*/