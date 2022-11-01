import { Request, Response, Router } from "express";
import { User } from "../models";
const bcrypt = require("bcryptjs");

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    console.log(req.body);
    const { username, password } = req.body;
      
    try{
      const potentialUser = await User.findOne({ username });
      if(!potentialUser){
        res.status(401).json({message:"Invalid Credentials!", error: "User not found."})
      }else{
        bcrypt.compare(password, potentialUser.password).then(function (result: any) {
        result
          ? res.status(200).json({
              message: "Login successful",
              username:potentialUser.username,
              email:potentialUser.email,
              groups:potentialUser.groups
            })
          : res.status(400).json({ message: "Login not succesful", error: "error"})
        })
      }
    }catch(error){
      res.status(400).json({message:"Error", error: error.message})
    }
});

export default router;
