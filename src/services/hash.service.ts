import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

export const encodePassword = async (
  plainTextPassword: string,
  next: NextFunction
): Promise<string> => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    if (!hash) {
      const error = new Error('Erro ao registrar a senha!');
      next(error);
    } else {
      return hash;
    }
  } catch (error) {
    next(error);
  }
};

export const decodePassword = async (
  inputPassword: string,
  hashedPassword: string,
  next: NextFunction
): Promise<boolean> => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    next(error);
  }
};
