import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { sendCreated } from '../utils/response.js';
import userService from '../services/user.service.js';

interface CreateUserBody {
  username: string;
  fullName: string;
}

export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, fullName } = req.body as CreateUserBody;

  const user = await userService.createUser(username, fullName);

  sendCreated(res, user);
});
