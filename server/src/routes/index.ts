import { Router } from "express";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import ResetPassword from "./ResetPassword";
import Group from "./Group";
import Post from "./Post";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";

const router = Router();

router.use("/SignUp", SignUp);
router.use("/LogIn", LogIn);
router.use("/ResetPassword", ResetPassword);
router.use("/Group", Group);
router.use("/Post", Post);
router.use("/Leaderboard", Leaderboard);
router.use("/Profile", Profile);

export default router;
