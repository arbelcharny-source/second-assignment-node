import express from "express";
import { createPost, getAllPosts, getPostByID, getPostsBySender, updatePost } from "../controllers/post-controller.js";
import { validatePostCreation, validatePostUpdate } from "../middleware/validation.middleware.js";
import { validateObjectId } from "../utils/validation.js";

const router = express.Router();

router.post("/", validatePostCreation, createPost);
router.get("/", getAllPosts);
router.get("/:_id", validateObjectId("_id"), getPostByID);
router.get("/sender/:ownerId", validateObjectId("ownerId"), getPostsBySender);
router.put("/:_id", validateObjectId("_id"), validatePostUpdate, updatePost);

export default router;
