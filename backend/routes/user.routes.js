import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSideBar } from "../controllers/user.controller.js";
const router = express.Router();

// Route To Get All Users
router.get("/", protectRoute, getUsersForSideBar);

export default router;
