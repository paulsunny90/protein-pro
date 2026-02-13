import { Request, Response } from "express";
import Userlog from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/mail.utils";
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    // const user = await Userlog.findOne({ email });
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
      sameSite: "lax",
      secure: false,
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
      sameSite: "lax",
      secure: false, // Set to true in production
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed", token: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

/**
 * Google OAuth Callback Controller
 * Handles the callback from Google OAuth, generates tokens, sets cookies, and redirects
 */
export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as any; // Passport attaches user object

  console.log("📥 Received user from Passport:", user);

  // ✅ Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  console.log("🔐 Generated tokens:");
  console.log("  AccessToken:", accessToken);
  console.log("  RefreshToken:", refreshToken);

  // ✅ Set Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // ✅ Set Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // Set to true in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log("🍪 Cookies set successfully");
  console.log("✅ Google Login Success - Redirecting to:", `${process.env.CLIENT_URL}/login/success`);

  // ✅ Redirect to client success page (NO token in URL)
  res.redirect(`${process.env.CLIENT_URL}/auth/login-success`);
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, name } = req.body; // Can be email or phone number

    if (!identifier) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }

    // Find user
    let user = await Userlog.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }]
    });

    if (!user) {
      const isEmail = identifier.includes('@');
      user = await Userlog.create({
        name: name || identifier.split('@')[0],
        email: isEmail ? identifier : `${identifier}@phone.user`,
        phoneNumber: isEmail ? undefined : identifier,
        authProvider: 'local',
        isVerified: false
      });
    } else if (name) {
      user.name = name;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    if (user.email) {
      await sendOTP(user.email, otp);
    }

    if (user.phoneNumber) {
      console.log(`[SMS Simulation] Sending OTP ${otp} to ${user.phoneNumber}`);
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("REQUEST OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ message: "Identifier and OTP are required" });
    }

    const user = await Userlog.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshTokenValue = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpires;

    res.json({ message: "Login successful", token: accessToken, user: userResponse });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

















