import mongoose from "mongoose";
const medicineSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    genericName:{
        type:String,
        required:true,
        trim:true
    },
    manufacturer:{
        type:String,
         
    },
    dosageForm:{
        type:String,
        required:true
         
    },
    strength:{
        type:String,
        required:true
    },
    sideEffects:{
        type:String,
         
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Medicine=mongoose.model("medicine",medicineSchema)
export default Medicine






    

