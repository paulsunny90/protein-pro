import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Define user payload interface
interface UserPayload {
  id: Types.ObjectId;
  email: string;
  role: string;
}

/**
 * Generate Access Token
 * @param user - User object containing id, email, and role
 * @returns JWT access token string
 */
export const generateAccessToken = (user: { 
  _id: Types.ObjectId; 
  email: string; 
  role: string 
}): string => {
  const payload: UserPayload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "fallback_access_secret",
    { expiresIn: "15m" }
  );
};

/**
 * Generate Refresh Token
 * @param user - User object containing id, email, and role
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (user: { 
  _id: Types.ObjectId; 
  email: string; 
  role: string 
}): string => {
  const payload: UserPayload = {
    id: user._id,
    email: user.email,
    role: user.role
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