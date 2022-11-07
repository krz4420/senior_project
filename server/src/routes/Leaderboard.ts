import { Request, Response, Router } from "express";
import { Group, Post, User } from "../models";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  console.log(req.query.group);
  let userPostFrequency: any = {};
  Post.find({ group: req.query.group })
    .then((data: any) => {
      data.map((post: any) => {
        if (userPostFrequency[post.user]) {
          userPostFrequency[post.user] += 1;
        } else {
          userPostFrequency[post.user] = 1;
        }
      });

      console.log(userPostFrequency);
      let returnValue = [];
      for (const [key, value] of Object.entries(userPostFrequency)) {
        returnValue.push({ postCount: value, username: key });
      }

      res.status(200).json(returnValue);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

export default router;
