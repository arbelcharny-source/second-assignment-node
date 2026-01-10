import mongoose from "mongoose";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import User from "../models/user.js";

export const createComment = async (req, res) => {
  const { content, postId, ownerId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).send(`Invalid User ID format`);
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).send(`Invalid Post ID format`);
    }

    const userExists = await User.findById(ownerId);
    if (!userExists) {
      return res.status(404).send(`User ${ownerId} not found`);
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).send(`Post ${postId} not found`);
    }

    const comment = await Comment.create({
      content,
      postId,
      ownerId,
    });

    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send(comments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getCommentByID = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: 'Invalid Comment ID format' });
  }

  try {
    const comment = await Comment.findById(_id);
    if (!comment) {
        return res.status(404).send(`Comment ${_id} not found`);
    }
    res.send(comment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Invalid Post ID format");
  }

  const postExists = await Post.findById(postId);
  if (!postExists) {
    return res.status(404).send(`Post ${postId} not found`);
    }

  try {
    const comments = await Comment.find({ postId: postId });
    res.send(comments);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { _id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({ message: 'Invalid Comment ID format' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      _id,
      { content },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedComment) {
      return res.status(404).send(`Comment ${_id} not found`);
    }

    res.status(200).json(updatedComment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({ message: 'Invalid Comment ID format' });
    }

    const deletedComment = await Comment.findByIdAndDelete(_id);

    if (!deletedComment) {
      return res.status(404).send(`Comment ${_id} not found`);
    }
    res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};