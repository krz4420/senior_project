import { Request, Response, Router } from "express";
import { User } from "../models";
const bcrypt = require("bcryptjs");

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    console.log(req.body);
    const { username, email, password } = req.body;

    // Query db to see if username and/or email exist
    const isUsernameTaken = await User.findOne({username});
    const isEmailTaken = await User.findOne({email});

    console.log(isUsernameTaken);
    console.log(isEmailTaken);

    // Return error code and error messages if username and/or email are already taken
    if(isUsernameTaken != null && isEmailTaken != null){
      console.log("Username and email taken")
      return res.status(400).send({message:"Username and Email Taken!"});
    }else if(isUsernameTaken != null){
      console.log("Username taken")
      return res.status(400).send({message: "Username Taken!"});
    }else if (isEmailTaken != null){
      console.log("email taken")
      return res.status(400).send({message:"Email already in use!"});
    }

    // Create new user. Hash the password and then store it in db.
    bcrypt.hash(password, 10).then(async (hash: any) => {
      await User.create({
        username,
        email,
        password: hash,
      })
        .then((user) =>
          res.status(200).json({
            message: "User successfully created",
             user,
          })
          
        )
        .catch((error) =>
          res.status(400).json({
            message: error.message,
            error: error.message,
          })
        );
    });
   
});

export default router;
