import { Request, Response, Router } from "express";
import { Group, Post, User } from "../models";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let userPostFrequency: any = {};

  const query =
    req.query.endDate != "null"
      ? {
          group: req.query.group,
          createdAt: {
            $gte: req.query.endDate,
            $lte: req.query.startDate,
          },
        }
      : { group: req.query.group };

  Post.find(query)
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
