import BaseError from "./base-error";

export default class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409);
  }
}
