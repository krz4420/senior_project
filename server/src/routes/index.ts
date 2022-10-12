import { Router } from "express";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import ResetPassword from './ResetPassword';
import Group from './Group';

const router = Router();

router.use("/SignUp", SignUp);
router.use("/LogIn", LogIn);
router.use("/ResetPassword", ResetPassword);
router.use("/Group", Group)
export default router;
