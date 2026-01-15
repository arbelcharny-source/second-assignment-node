import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendCreated } from '../utils/response.js';
import userService from '../services/user.service.js';

interface CreateUserBody {
  username: string;
  email: string;
  fullName: string;
}

export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, fullName } = req.body as CreateUserBody;

  const user = await userService.createUser(username, email, fullName);

  sendCreated(res, user);
});
