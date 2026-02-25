import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Define user payload interface
interface UserPayload {
  id: any;
  email: string;
  role: string;
  name: string;
}

/**
 * Generate Access Token
 * @param user - User object containing id, email, and role
 * @returns JWT access token string
 */
export const generateAccessToken = (user: {
  _id: any;
  email: string;
  role: string;
  name: string;
}): string => {
  const payload: UserPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "fallback_access_secret",
    { expiresIn: "1h" } // Increased to 1h for better DX
  );
};

/**
 * Generate Refresh Token
 * @param user - User object containing id, email, and role
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (user: {
  _id: any;
  email: string;
  role: string;
  name: string;
}): string => {
  const payload: UserPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret",
    { expiresIn: "7d" }
  );
};

/**
 * Verify Access Token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyAccessToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "fallback_access_secret"
    ) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Verify Refresh Token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyRefreshToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret"
    ) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};