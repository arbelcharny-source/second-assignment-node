import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  const { title, content, ownerId, imageUrl } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(404).json({ message: 'Invalid User ID format' });
    }

    const userExists = await User.findById(ownerId);
    if (!userExists) {
      return res.status(400).send(`User ${ownerId} not found`);
    }

    const post = await Post.create({
      title,
      content,
      ownerId,
      imageUrl,
    });

    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPostByID = async (req, res) => {
  const id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Post ID format' });
  }

  const postExists = await Post.findById(id);
  if (!postExists) {
    return res.status(400).send(`Post ${id} not found`);
  }

  try {
    const post = await Post.findById(
      { _id: id });
    res.send(post)
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getPostsBySender = async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(404).json({ message: 'Invalid User ID format' });
    }

    const userExists = await User.findById(ownerId);
    if (!userExists) {
      return res.status(400).send(`User ${ownerId} not found`);
    }
    
    const posts = await Post.find(
      { ownerId: ownerId });
    res.send(posts)
  } catch (error) {
    res.status(400).send(error.message);
  }
};


export const updatePost = async (req, res) => {
    try {
    const id = req.params._id;
    const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Post ID format' });
  }

  const postExists = await Post.findById(id);
  if (!postExists) {
    return res.status(400).send(`Post ${id} not found`);
  }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content },
      { 
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(updatedPost);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
