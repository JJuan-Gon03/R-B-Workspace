import express from "express";
import { postUser, login } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", postUser);
router.post("/login", login);

export default router;
