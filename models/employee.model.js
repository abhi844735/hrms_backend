const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name:{type:String,required:true},
    department:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["employee","hr"],default:"employee"},
    contact : {type:String,required:true},
    leaveHistory:[{type:mongoose.Schema.Types.ObjectId,ref:"Leave"}]
});
module.exports = mongoose.model("Employee",employeeSchema);
