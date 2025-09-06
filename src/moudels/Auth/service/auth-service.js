import User from "../../../database/models/user-model.js";
import { emitter } from "../../../service/send-email.js";
import { compareSync, hashSync } from "bcrypt";
import bcrypt from "bcrypt";
import { decruption, encription } from "../../../utilites/encruption.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { BlackListToken } from "../../../database/models/balck_listtoken-model.js";
export const signupService = async (req,res,next) => {

    const {username,email,password,gender,role,phone,priviteaccount}=req.body;

const isUserExist = await User.findOne({email})

if(isUserExist){
    return next(new Error("User already exist"))
}
const ispublic = priviteaccount ? false : true
const otp = Math.floor(100000 + Math.random() * 900000);
const hashedotp = hashSync(otp.toString(), 10);
emitter.emit("sendemail", {
    email,
    subject: "welcome to e-learning plateform",
    html: `<h1>${otp}</h1> `

});
const hashedpassword=hashSync(password,10)
const decryptedphone=await encription({value:phone,secretkey:process.env.SECRET_KEY})
const user = new User({username,email,password:hashedpassword,gender,role,phone:decryptedphone,ispublic,otp:hashedotp})
 await user.save()
 console.log("OTP generated:", otp);

res.status(201).json({message:"User created successfully",user})
}


export const signinService=async(req,res)=>{
    const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accesstoken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.jwt_accesstoken,
            { expiresIn: "2h", jwtid: uuidv4() }
        );

        const refreshtoken = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.jwt_refreshtoken,
            { expiresIn: "1d", jwtid: uuidv4() }
        );

        res.status(200).json({
            message: "User signed in successfully",
            accesstoken,
            refreshtoken
        });
}


export const verifyotpService = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "user not found" });
        if (!user.otp) {
            return res.status(400).json({ message: "OTP not set for this user" });
        }
        const isotpMatched = compareSync(otp.toString(), user.otp);
        if(!isotpMatched) return res.status(400).json({ message: "invalid otp" });

        await User.findByIdAndUpdate(user._id, { isverified: true, $unset: { otp: "" } });

        res.status(200).json({ message: "user verified" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}


export const signoutService = async (req, res) => {
    try {
        const { accesstoken, refreshtoken } = req.headers;
       
        const decodedaccesstoken = jwt.verify(accesstoken, process.env.jwt_accesstoken);
        const decodedrefreshtoken = jwt.verify(refreshtoken, process.env.jwt_refreshtoken);

        const revokedtoken = await BlackListToken.insertMany([
            { tokenid: decodedaccesstoken.jti, expirydate: new Date(decodedaccesstoken.exp * 1000) },
            { tokenid: decodedrefreshtoken.jti, expirydate: new Date(decodedrefreshtoken.exp * 1000) }
        ]);

        if (!revokedtoken) {
            throw new Error("Token not revoked");
        }

        res.status(200).json({ message: "user signed out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};



export const forgetpasswordService=async(req,res)=>{
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedotp = hashSync(otp.toString(), 10);
        await User.findByIdAndUpdate(user._id, { confirmotp: hashedotp })
        emitter.emit("sendemail", {
            email,
            subject: "welcome to e-learning plateform",
            html: `<h1>${otp}</h1> `

        });
        res.status(200).json({ message: "otp sent" })


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const resetpasswordService = async (req, res) => {
    try {
        const { email, otp, password, confirmpassword } = req.body;

        if (!email || !otp || !password || !confirmpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        if (!user.confirmotp) {
            return res.status(400).json({ message: "OTP not set or expired" });
        }

        const isOtpMatched = compareSync(otp.toString(), user.confirmotp);
        if (!isOtpMatched) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Password not matched" });
        }

        const hashedpassword = hashSync(password, 10);

        await User.updateOne(
            { email },
            { password: hashedpassword, $unset: { confirmotp: "" } } // ✅ هنا لازم confirmotp مش otp
        );

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
