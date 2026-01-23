import express from "express";
import { createUser } from "../controllers/user-controller.js";
import { validateUserRegistration } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/register", validateUserRegistration, createUser);

export default router;
