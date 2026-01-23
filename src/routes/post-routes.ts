import express from "express";
import { createPost, getAllPosts, getPostByID, getPostsBySender, updatePost } from "../controllers/post-controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:_id", getPostByID);
router.get("/sender/:ownerId", getPostsBySender);
router.put("/:_id", updatePost);

export default router;
