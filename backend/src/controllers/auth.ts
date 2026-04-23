import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import BaseError from "../errors/base-error";
import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import User from "../models/user";
interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}
import {
  createAccessToken,
  createRefreshToken,
  refreshCookie,
  verifyToken,
} from "../utils/auth";

const UNAUTHORIZED_MESSAGE = "Incorrect email or password";

const sendAuthResponse = async (
  userId: string,
  name: string,
  email: string,
  res: Response,
) => {
  const accessToken = createAccessToken({ _id: userId });
  const refreshToken = createRefreshToken({ _id: userId });

  await User.findByIdAndUpdate(userId, {
    $push: { tokens: { token: refreshToken } },
  });

  res.cookie(refreshCookie.name, refreshToken, refreshCookie.options);

  return res.json({
    user: {
      email,
      name,
    },
    success: true,
    accessToken,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return sendAuthResponse(
      user._id.toString(),
      user.name || "Ё-мое",
      user.email,
      res,
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes("E11000")) {
      return next(new ConflictError("User with this email already exists"));
    }

    if (err instanceof Error && err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }

    return next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new BaseError(UNAUTHORIZED_MESSAGE, 401));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(new BaseError(UNAUTHORIZED_MESSAGE, 401));
    }

    return sendAuthResponse(
      user._id.toString(),
      user.name || "Ё-мое",
      user.email,
      res,
    );
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new BaseError("User not found", 404));
    }

    return res.json({
      user: {
        email: user.email,
        name: user.name || "Ё-мое",
      },
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[refreshCookie.name];

    if (!refreshToken) {
      return next(new BaseError("Authorization required", 401));
    }

    const payload = verifyToken(refreshToken);

    const user = await User.findById(payload._id).select("+tokens");

    if (!user) {
      return next(new BaseError("User not found", 404));
    }

    const hasToken = user.tokens?.some((item) => item.token === refreshToken);

    if (!hasToken) {
      return next(new BaseError("Authorization required", 401));
    }

    user.tokens = (user.tokens || []).filter(
      (item) => item.token !== refreshToken,
    );
    await user.save();

    return sendAuthResponse(
      user._id.toString(),
      user.name || "Ё-мое",
      user.email,
      res,
    );
  } catch (err) {
    return next(new BaseError("Authorization required", 401));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.[refreshCookie.name];

    if (!refreshToken) {
      return next(new BaseError("Authorization required", 401));
    }

    const payload = verifyToken(refreshToken);

    const user = await User.findById(payload._id).select("+tokens");

    if (!user) {
      return next(new BaseError("User not found", 404));
    }

    user.tokens = (user.tokens || []).filter(
      (item) => item.token !== refreshToken,
    );
    await user.save();

    res.clearCookie(refreshCookie.name, refreshCookie.options);

    return res.json({
      success: true,
    });
  } catch (err) {
    return next(new BaseError("Authorization required", 401));
  }
};
