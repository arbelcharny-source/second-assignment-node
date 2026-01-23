import User, { IUser } from '../models/user.js';
import { AppError } from '../middleware/error.middleware.js';

export class UserService {
  async createUser(username: string, email: string, fullName: string): Promise<IUser> {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new AppError('Username already exists', 409);
      }
      if (existingUser.email === email) {
        throw new AppError('Email already exists', 409);
      }
    }

    const user = await User.create({ username, email, fullName });
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
