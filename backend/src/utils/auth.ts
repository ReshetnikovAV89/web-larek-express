import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';

const JWT_SECRET = 'super-strong-secret';

const getExpiry = (
  value: string | undefined,
  fallback: StringValue,
): StringValue => (value as StringValue) || fallback;

const AUTH_ACCESS_TOKEN_EXPIRY = getExpiry(
  process.env.AUTH_ACCESS_TOKEN_EXPIRY,
  '10m',
);

const AUTH_REFRESH_TOKEN_EXPIRY = getExpiry(
  process.env.AUTH_REFRESH_TOKEN_EXPIRY,
  '7d',
);

interface JwtPayload {
  _id: string;
}

export const createAccessToken = (payload: JwtPayload): string => jwt.sign(
  payload,
  JWT_SECRET,
  {
    expiresIn: AUTH_ACCESS_TOKEN_EXPIRY,
  },
);

export const createRefreshToken = (payload: JwtPayload): string => jwt.sign(
  payload,
  JWT_SECRET,
  {
    expiresIn: AUTH_REFRESH_TOKEN_EXPIRY,
  },
);

export const refreshCookie: { name: string; options: CookieOptions } = {
  name: 'refreshToken',
  options: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY),
    path: '/',
  },
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  return decoded;
};
