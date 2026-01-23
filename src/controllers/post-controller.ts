import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from "../models/post.js";
import User from "../models/user.js";

interface CreatePostBody {
    title: string;
    content: string;
    ownerId: string;
    imageAttachmentUrl?: string;
}

interface UpdatePostBody {
    content: string;
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { title, content, ownerId, imageAttachmentUrl } = req.body as CreatePostBody;

    try {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: 'Invalid User ID format' });
            return;
        }

        const userExists = await User.findById(ownerId);
        if (!userExists) {
            res.status(404).send(`User ${ownerId} not found`);
            return;
        }

        const post = await Post.create({
            title,
            content,
            ownerId,
            imageAttachmentUrl,
        });

        res.status(201).send(post);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({});
        res.send(posts);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getPostByID = async (req: Request, res: Response): Promise<void> => {
    const id = req.params._id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid Post ID format' });
        return;
    }

    try {
        const post = await Post.findById(id);
        
        if (!post) {
            res.status(404).send(`Post ${id} not found`);
            return;
        }

        res.send(post);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getPostsBySender = async (req: Request, res: Response): Promise<void> => {
    const ownerId = req.params.ownerId as string;

    try {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            res.status(400).json({ message: 'Invalid User ID format' });
            return;
        }

        const userExists = await User.findById(ownerId);
        if (!userExists) {
            res.status(404).send(`User ${ownerId} not found`);
            return;
        }

        const posts = await Post.find({ ownerId: ownerId });
        res.send(posts);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params._id as string;
        const { content } = req.body as UpdatePostBody;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Post ID format' });
            return;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { content },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPost) {
            res.status(404).send(`Post ${id} not found`);
            return;
        }

        res.status(200).json(updatedPost);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};