import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '../utils/validation.js';
import { sendValidationError } from '../utils/response.js';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, fullName } = req.body;

  if (!username || !email || !fullName) {
    sendValidationError(res, 'Username, email, and fullName are required');
    return;
  }

  if (typeof username !== 'string' || typeof email !== 'string' || typeof fullName !== 'string') {
    sendValidationError(res, 'Username, email, and fullName must be strings');
    return;
  }

  if (username.trim().length < 3 || username.trim().length > 50) {
    sendValidationError(res, 'Username must be between 3 and 50 characters');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    sendValidationError(res, 'Invalid email format');
    return;
  }

  if (fullName.trim().length < 2 || fullName.trim().length > 100) {
    sendValidationError(res, 'Full name must be between 2 and 100 characters');
    return;
  }

  next();
};

export const validatePostCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { title, content, ownerId } = req.body;

  if (!title || !content || !ownerId) {
    sendValidationError(res, 'Title, content, and ownerId are required');
    return;
  }

  if (!isValidObjectId(ownerId)) {
    sendValidationError(res, 'Invalid ownerId format');
    return;
  }

  next();
};

export const validatePostUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { content } = req.body;

  if (!content) {
    sendValidationError(res, 'Content is required');
    return;
  }

  if (typeof content !== 'string') {
    sendValidationError(res, 'Content must be a string');
    return;
  }

  if (content.trim().length < 1 || content.trim().length > 10000) {
    sendValidationError(res, 'Content must be between 1 and 10000 characters');
    return;
  }

  next();
};

export const validateCommentCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { content, postId, ownerId } = req.body;

  if (!content || !postId || !ownerId) {
    sendValidationError(res, 'Content, postId, and ownerId are required');
    return;
  }

  if (typeof content !== 'string' || typeof postId !== 'string' || typeof ownerId !== 'string') {
    sendValidationError(res, 'Content, postId, and ownerId must be strings');
    return;
  }

  if (content.trim().length < 1 || content.trim().length > 5000) {
    sendValidationError(res, 'Content must be between 1 and 5000 characters');
    return;
  }

  if (!isValidObjectId(postId)) {
    sendValidationError(res, 'Invalid postId format');
    return;
  }

  if (!isValidObjectId(ownerId)) {
    sendValidationError(res, 'Invalid ownerId format');
    return;
  }

  next();
};

export const validateCommentUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { content } = req.body;

  if (!content) {
    sendValidationError(res, 'Content is required');
    return;
  }

  if (typeof content !== 'string') {
    sendValidationError(res, 'Content must be a string');
    return;
  }

  if (content.trim().length < 1 || content.trim().length > 5000) {
    sendValidationError(res, 'Content must be between 1 and 5000 characters');
    return;
  }

  next();
};
