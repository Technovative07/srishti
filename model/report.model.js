import mongoose from "mongoose";
import patient from "./patient.model.js";
const reportSchema= new mongoose.Schema({
    patientName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient"
    
    },
    doctorName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    
    },
    keyfinds:{
        type:String,
        required:true
    },
    reportDate:{
        type:Date,
        required:true

    },
    attachedFile:{type:String},
    precription:{type:String},
    createdAt:{
        type:Date,
        default:Date.now
    }

})
const Report= mongoose.model("report",reportSchema);
export default Report;

