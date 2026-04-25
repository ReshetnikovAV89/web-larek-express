import BaseError from './base-error';

export default class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}
