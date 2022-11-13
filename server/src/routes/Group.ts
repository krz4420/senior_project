import { Request, Response, Router } from "express";
import { User, Group, Post } from "../models";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  const { groupname, username, userID } = req.body;

  try {
    const potentialGroup = await Group.findOne({ name: groupname });
    console.log(potentialGroup);

    if (potentialGroup != null) {
      return res
        .status(401)
        .json({ message: "GroupId Is taken", error: "Group ID is taken" });
    } else {
      // Create the group and return if an error occurs
      await Group.create({ name: groupname }).catch((error) => {
        return res.status(400).json({ message: error });
      });

      // Update the user's group array and return if an error occurs
      await User.updateOne(
        { username },
        { $push: { groups: groupname } }
      ).catch((error) => {
        return res.status(400).json({ message: error });
      });

      // Add userID to the member array of the group
      await Group.updateOne(
        { name: groupname },
        { $push: { members: username } }
      ).catch((error) => {
        return res.status(400).json({ message: error });
      });

      return res.status(200).json("Group created successfully");
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
});

router.post("/join", async (req: Request, res: Response) => {
  const { groupname, username, userID } = req.body;

  try {
    const potentialGroup = await Group.findOne({ name: groupname });
    console.log(potentialGroup);
    if (!potentialGroup) {
      return res
        .status(401)
        .json({ message: `Group ${groupname} does not exist.` });
    } else {
      await User.updateOne(
        { username, groups: { $ne: groupname } },
        { $push: { groups: groupname } }
      )
        .then((result) => {
          // If no objects are modified then the user is already in the group
          if (result.modifiedCount == 0) {
            return res
              .status(400)
              .json({ message: "Already a member of the group!" });
          }
        })
        .catch((err) => {
          return res.status(400).json({ message: err.message });
        });

      // Add username to the member array of the group
      await Group.updateOne(
        { name: groupname },
        { $push: { members: username } }
      ).catch((error) => {
        return res.status(400).json({ message: error });
      });
      return res.status(200).json({ message: "Success" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

export default router;
