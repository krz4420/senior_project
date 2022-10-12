import { Request, Response, Router } from "express";
import { User } from "../models";

const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

require('dotenv').config();

const router = Router();
let uniqueId:Number = -1;
let email= null;

/*
End point for ForgotPasswordScreen. This takes in a username in the Request and verifies this 
username corresponds to an account. It returns the email associated with the account (might have
    to change the way I implemented this. I think this may be a security flaw. I can request the
    email in the comfirmReset endpoint but wanted to avoid making unnecessary requests).
*/
router.post("/reset", async (req: Request, res: Response) => {
    console.log(req.body);
    const { username } = req.body;
      
    try{
      const potentialUser = await User.findOne({ username });
      console.log(`User: ${potentialUser}`);

      if(!potentialUser){
        res.status(401).json({message:"Invalid Username!", error: "Username not found"});
      }else{
        res.status(200).json( {message: "Valid Username", email: potentialUser.email});
      }
    }catch(error){
      res.status(400).json({message:"Error", error: error.message});
    }
});

router.post("/generateCode", async (req: Request, res: Response) => {
   uniqueId = sendCode(req.body.email);

   if (uniqueId == -1){
    res.status(401).json({message:"Error generating code"});
   }
});

router.post("/confirmReset", async (req: Request, res: Response) => {
    
    console.log(req.body);
    
    // Extract the code user submitted
    const { code } = req.body;
    console.log(uniqueId);

    // The code the user entered matches the generated one.
    if (Number(code) == uniqueId){
        console.log("resetting")

        try{
            resetPassword(req.body.password, req.body.username);
        }catch(error){
            return res.status(400).json(error);
        }
        return res.status(200).json({message: "success"});

        
    }else{
        res.status(400).json({message:"Incorrect Code"})
    }
});

const resetPassword = async (newPassword: String, username:String) => {
    try{
        bcrypt.hash(newPassword, 10).then(async (hash: any) => {
            await User.findOne({
              username,
            })
              .then((user) => {
                user.password = hash;
                user.save();
                
              })
              .catch((error) => {return error});
          });
        }
    catch(error){ 
        return error;
    }
    console.log("Resetting the password");
};

const sendCode = (to: any) => {
    // Create Random 4-digit number
    const val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);

    // Send to user's email
    const transporter = nodemailer.createTransport({
        service: "Gmail",
           auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASS,
             },
        });

    const mailData = {
        from: process.env.EMAIL_USERNAME,  // sender address
            to,   // list of receivers
            subject: 'Boneyard Account Confirmation Code',
            text: `Your unique confirmation code is: ${val}`,
        };

    transporter.sendMail(mailData, function (error: any, info: any) {
        if(error){
            console.log(error);
            return -1;
        }
    })
    return val;
}
export default router;
