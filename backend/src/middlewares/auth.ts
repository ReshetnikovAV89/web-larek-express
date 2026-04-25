import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';
import { verifyToken } from '../utils/auth';

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: AuthRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization required'));
  }

  try {
    const token = extractBearerToken(authorization);
    const payload = verifyToken(token);

    req.user = payload;

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }
};
