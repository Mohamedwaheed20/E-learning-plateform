import jwt from "jsonwebtoken";
import { User } from "../db/models/user_models.js";
import { BlackListToken } from "../db/models/blacklisttoken.js";

const validateToken = async (accesstoken) => {
    try {
        
        const decoded = jwt.verify(accesstoken, process.env.jwtsecretkey);
            
        const isblacklisted = await BlackListToken.findOne({ tokenid: decoded.jti });
        if (isblacklisted) {
            return res.status(401).json({ message: 'this token is expired and blacklisted' });
        }
        const user = await User.findById(decoded.publicclaims, "-password");
        if (!user) {
            return res.status(401).json({ message: 'please signup' });
        }
        return { ...user._doc, tokenid: decoded.jti, expirydate: decoded.exp }
    }
    catch (error) {
        console.log(error);
        
    }
}


export const authantication_middelware =  (sockettocken) => {
    if(sockettocken) return  validateToken(sockettocken);

    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers;
            if (!accesstoken) {
                return res.status(401).json({ message: 'Unauthorized', error: "token is required" });
            }


            const decoded = jwt.verify(accesstoken, process.env.jwtsecretkey);
            
            
            const isblacklisted = await BlackListToken.findOne({ tokenid: decoded.jti });
            if (isblacklisted) {
                return res.status(401).json({ message: 'this token is expired and blacklisted' });
            }
            const user = await User.findById(decoded.publicclaims, "-password");
            if (!user) {
                return res.status(401).json({ message: 'please signup' });
            }
            req.authuser = user;
            req.authuser.token = { tokenid: decoded.jti, expirydate: decoded.exp }

            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong', error });
        }
    }
}




export const authrization_middelware = (allowedroles) => {
    return (req, res, next) => {
        try {
            const { role } = req.authuser;
            if (!allowedroles.includes(role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong', error });

        }

    }
}   


export const graphauthantication_middelware = async (accesstoken) => {

        try {
           


            const decoded = jwt.verify(accesstoken, process.env.jwtsecretkey);
            
            
            const isblacklisted = await BlackListToken.findOne({ tokenid: decoded.jti });
            if (isblacklisted) {
                return new Error("this token is expired and blacklisted")
            }
            const user = await User.findById(decoded.publicclaims, "-password");
            if (!user) {
                return new Error("please signup")
            }
            return { ...user._doc, tokenid: decoded.jti, expirydate: decoded.exp }
        }
        catch (error) {
            console.log(error);
            return new Error("Something went wrong", error);
        }
    }
