import { Router } from "express";
import DoggoRoutes from "./doggos";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import ResetPassword from './ResetPassword';

const router = Router();

router.use("/doggo", DoggoRoutes);
router.use("/SignUp", SignUp);
router.use("/LogIn", LogIn);
router.use("/ResetPassword", ResetPassword);

export default router;
