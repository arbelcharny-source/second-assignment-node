import User, { IUser } from '../models/user.js';
import { AppError } from '../middleware/error.middleware.js';

export class UserService {
  async createUser(username: string, fullName: string): Promise<IUser> {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new AppError('Username already exists', 409);
    }

    const user = await User.create({ username, fullName });
    return user;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(`User with id ${userId} not found`, 404);
    }

    return user;
  }

  async checkUserExists(userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    return !!user;
  }
}

export default new UserService();
