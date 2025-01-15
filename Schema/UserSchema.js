const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minlength:5,
    },
    OTP:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"offline"
    },
    admin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});
const user=mongoose.model("User",UserSchema);
module.exports=user;