import { Request, Response } from 'express';
import User from "../models/user.js";

interface CreateUserBody {
    username: string;
    fullName: string;
}

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userBody = req.body as CreateUserBody;

        const existingUser = await User.findOne({ username: userBody.username });
        if (existingUser) {
            res.status(409).send("Username already exist!");
            return;
        }

        const user = await User.create(userBody);
        res.status(201).send(user);

    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};