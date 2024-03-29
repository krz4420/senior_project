import { Request, Response, Router } from "express";
import { Group, Post } from "../models";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let userPostFrequency: any = {};
  let returnValue: any = [];

  // Create the query to perform on the database. If the endDate passed from the front end is "null"
  // Then the user selected the "All time" filter option and we do not care about querying based on timestamps
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

  await Post.find(query)
    .then((data: any) => {
      data.map((post: any) => {
        // If the user is already in the dictionary then update the post count
        if (userPostFrequency[post.user]) {
          userPostFrequency[post.user] += 1;
        } else {
          // If the user is not in the dictionary then add them with a value of 1
          userPostFrequency[post.user] = 1;
        }
      });

      //  Create an array to pass back to frontend consisting of key value pairs associated with username and postcount
      for (const [key, value] of Object.entries(userPostFrequency)) {
        returnValue.push({ postCount: value, username: key });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });

  // Sort the return value from descending
  returnValue.sort((x: any, y: any) => {
    return y.postCount - x.postCount;
  });

  let totalUsers: any = [];
  await Group.findOne({ name: req.query.group })
    .then((data: any) => {
      totalUsers = data.members;
    })
    .catch((error) => {
      return res.status(400).json(error);
    });

  // Update the state to reflect the sorted array of users from those with the largest post count to smallest
  totalUsers.map((user: any) => {
    if (
      !returnValue.some((userWhoPosted: any) => userWhoPosted.username == user)
    ) {
      returnValue.push({ postCount: 0, username: user });
    }
  });

  res.status(200).json({ userPostCount: returnValue });
});

export default router;
