import express from "express";
import { auth } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/auth", auth);

export default router;
