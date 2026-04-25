import { NextFunction, Request, Response } from 'express';
import BaseError from '../errors/base-error';

export default (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};
