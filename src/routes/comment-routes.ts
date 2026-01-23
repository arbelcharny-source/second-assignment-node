import express from "express";
import {
  createComment,
  getAllComments,
  getCommentByID,
  getCommentsByPost,
  updateComment,
  deleteComment
} from "../controllers/comment-controller.js";
import { validateCommentCreation, validateCommentUpdate } from "../middleware/validation.middleware.js";
import { validateObjectId } from "../utils/validation.js";

const router = express.Router();

router.post("/", validateCommentCreation, createComment);
router.get("/", getAllComments);
router.get("/:_id", validateObjectId("_id"), getCommentByID);
router.get("/post/:postId", validateObjectId("postId"), getCommentsByPost);
router.put("/:_id", validateObjectId("_id"), validateCommentUpdate, updateComment);
router.delete("/:_id", validateObjectId("_id"), deleteComment);

export default router;
