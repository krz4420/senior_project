import { Request, Response, Router } from "express";
import { Group, Post } from "../models";
const axios = require("axios");

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { groupname, username } = req.body;
  let usersPost: any = [];

  await Post.find({ group: groupname, user: username })
    .then((data) => {
      data.sort((x, y) => {
        return y.createdAt - x.createdAt;
      });
      usersPost = data;
    })
    .catch((error) => {
      return res.send(400).json(error);
    });
  console.log(usersPost);
  // Ping the leaderboard route to get the sorted list of users for the group
  await axios
    .get(
      `${
        process.env.BACKEND
      }/Leaderboard?group=${groupname}&startDate=${Date.now()}&endDate=null`
    )
    .then(({ data }: any) => {
      console.log(data);

      // Get the user's position in the leaderboard
      const leaderboardPosition =
        1 +
        data.userPostCount.findIndex((user: any) => user.username == username);
      return res.status(200).json({ usersPost, leaderboardPosition });
    })
    .catch((error: any) => {
      return res.status(400).json(error);
    });
});

export default router;
