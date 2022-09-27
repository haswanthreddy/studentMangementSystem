import { application, Router } from "express";
import login  from "./login.js";
import signup from "./signup.js";

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router