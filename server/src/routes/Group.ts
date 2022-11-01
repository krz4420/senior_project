import { Request, Response, Router } from "express";
import { User, Group, Post } from "../models";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  console.log(req.body);
  const { groupname, username } = req.body;

  try {
    const potentialGroup = await Group.findOne({ name: groupname });
    console.log(potentialGroup);

    if (potentialGroup != null) {
      return res
        .status(401)
        .json({ message: "GroupId Is taken", error: "Group ID is taken" });
    } else {
      await Group.create({ name: groupname })
        .then(() => {
          console.log("in the create");
        })
        .catch((error) => {
          return res.status(400).json({ message: error });
        });

      await User.updateOne({ username }, { $push: { groups: groupname } })
        .then(() => {
          return res.status(200).json({ message: "success" });
        })
        .catch((error) => {
          return res.status(400).json({ message: error });
        });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
});

router.post("/join", async (req: Request, res: Response) => {
  const { groupname, username } = req.body;

  try {
    const potentialGroup = await Group.findOne({ name: groupname });
    console.log(potentialGroup);
    if (!potentialGroup) {
      console.log("Group does not exist");
      return res
        .status(401)
        .json({ message: `Group ${groupname} does not exist.` });
    } else {
      await User.updateOne(
        { username, groups: { $ne: groupname } },
        { $push: { groups: groupname } }
      )
        .then((result) => {
          console.log(result);
          if (result.modifiedCount == 0) {
            return res
              .status(400)
              .json({ message: "Already a member of the group!" });
          }
          return res.status(200).json({ message: "Success" });
        })
        .catch((err) => {
          return res.status(400).json({ message: err.message });
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

export default router;
