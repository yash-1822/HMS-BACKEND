// import mongoose from "mongoose";

// const appointmentSchema = new mongoose.Schema({
//     userId: {type: String, required:true},
//     // docId: {type: String, required:true},
//     slotDate: {type: String, required:true},
//     slotTime: {type: String, required:true},
//     // userData: {type: Object, required:true},
//     docData: {type: Object, required:true},
//     amount: {type: Number, required:true},
//     cancelled: {type: Boolean, default: false},
//     payment: {type: Boolean, default: false},
//     isCompleted: {type: Boolean, default: false},

// })

// const appointmentModel = mongoose.model('appointment',appointmentSchema)

// export default appointmentModel





const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // changed from userId
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  age: { type: Number, default:25 },  
  name:{type:String,required:true},
  phone: { type: String, required: true }, 
});



module.exports = mongoose.model("appointment", appointmentSchema);

