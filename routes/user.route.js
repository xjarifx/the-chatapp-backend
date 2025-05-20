import express from "express";
import { auth } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/auth", auth);

export default router;
