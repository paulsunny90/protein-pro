import { Request, Response } from "express";
import Userlog from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await Userlog.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({ message: "User not found!" });

    // 2️⃣ Google-only user block
    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "Please login using Google or set a password",
      });
    }

    // 3️⃣ Validate password
    if (!password)
      return res.status(400).json({ message: "Password is required!" });

    if (!user.password) {
      return res.status(400).json({
        message: "This account does not have a password. Login with Google or set a password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    // 4️⃣ Generate tokens 
    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken(user);

    // 5️⃣ Save tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6️⃣ Prepare user object for response (remove sensitive data)
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "Login successful", token: accessToken, user: userResponse });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed! Please try again." });
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    );

    const user = await Userlog.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed", token: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

/**
 * Google OAuth Callback Controller
 */
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.CLIENT_URL}/auth/login-success`);
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
