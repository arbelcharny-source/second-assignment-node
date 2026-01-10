import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../models/comment.js';
import Post from '../models/post.js';
import User from '../models/user.js';

interface CreateCommentBody {
    content: string;
    postId: string;
    ownerId: string;
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
    const { content, postId, ownerId } = req.body as CreateCommentBody;

    try {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).send(`Invalid User ID format`);
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).send(`Invalid Post ID format`);
            return;
        }

        const userExists = await User.findById(ownerId);
        if (!userExists) {
            res.status(404).send(`User ${ownerId} not found`);
            return;
        }

        const postExists = await Post.findById(postId);
        if (!postExists) {
            res.status(404).send(`Post ${postId} not found`);
            return;
        }

        const comment = await Comment.create({
            content,
            postId,
            ownerId,
        });

        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find({});
        res.send(comments);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getCommentByID = async (req: Request, res: Response): Promise<void> => {
    const id = req.params._id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: 'Invalid Comment ID format' });
        return;
    }

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            res.status(404).send(`Comment ${id} not found`);
            return;
        }
        res.send(comment);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
const postId = req.params.postId as string;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).send("Invalid Post ID format");
        return;
    }

    try {
        const postExists = await Post.findById(postId);
        if (!postExists) {
            res.status(404).send(`Post ${postId} not found`);
            return;
        }

        const comments = await Comment.find({ postId: postId });
        res.send(comments);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id as string;
        const { content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: 'Invalid Comment ID format' });
            return;
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedComment) {
            res.status(404).send(`Comment ${id} not found`);
            return;
        }

        res.status(200).json(updatedComment);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id as string;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404).json({ message: 'Invalid Comment ID format' });
            return;
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            res.status(404).send(`Comment ${id} not found`);
            return;
        }
        res.status(200).json({ message: 'Comment deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};