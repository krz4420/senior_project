import { Router } from "express";
import DoggoRoutes from "./doggos";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

const router = Router();

router.use("/doggo", DoggoRoutes);
router.use("/SignUp", SignUp);
router.use("/LogIn", LogIn);

export default router;
