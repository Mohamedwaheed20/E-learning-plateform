import mongoose from "mongoose";
import { hashSync } from "bcrypt";
import { encription } from "../../utilites/encruption.js";
import { system_constants } from "../../constant/constant.js";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
  
    gender: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: system_constants.admin,
        enum: [system_constants.admin, system_constants.user,system_constants.superadmin

        ]
    },
   
    otp:{
        type:String,
        default:""
    },
    confirmotp:{
        type:String,
        default:""
    },
   
}, {timestamps: true});

 const User = mongoose.models.User || mongoose.model("User", userSchema)

 userSchema.pre("save",function () {
    const changes=this.getChanges()[`$set`];
    if(changes.password){
    this.password=hashSync(this.password, +process.env.salt);
    }
 
})
 export default User
