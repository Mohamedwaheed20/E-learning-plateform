import nodemailer from "nodemailer"
import{EventEmitter } from "node:events"

export const sendemail=async(
    {
    to,
    subject,
    html
    }
    
)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.emailuser,
              pass: process.env.emailpassword
            }
            // tls: {
            //     rejectUnauthorized: false
            // }
          });
          const info = await transporter.sendMail({
            from: `"e-learning plateform App by Mohamed" <${process.env.emailuser}>`, // sender address
            to  ,  
            cc:"mohamedwaheed202005@gmail.com",      
            subject , 
            html,
            
          });
          return info
        }
     catch (error) {
        console.log(error);
        return error ;
        
    }
}
export const emitter=new EventEmitter();
emitter.on("sendemail",(...args)=>{
     
        console.log("eventriggedd",args)
     const {to,subject,html}=args[0];
     sendemail({to,subject,html})
     console.log("email sent");
     
        
    })