import express from "express";
import { 
  createComment, 
  getAllComments, 
  getCommentByID, 
  getCommentsByPost, 
  updateComment, 
  deleteComment 
} from "../controllers/comment-controller.js";

const router = express.Router();

router.post("/", createComment);
router.get("/", getAllComments);
router.get("/:_id", getCommentByID);
router.get("/post/:postId", getCommentsByPost);
router.put("/:_id", updateComment);
router.delete("/:_id", deleteComment);

export default router;