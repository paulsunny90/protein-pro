import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Userlog from "../models/user.model";

export const setPassword = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { password } = req.body;

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Weak password" });

  const hashed = await bcrypt.hash(password, 10);

  await Userlog.findByIdAndUpdate(userId, {
    password: hashed,
    authProvider: "local",
  });

  res.json({ message: "Password set successfully" });
};


export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await Userlog.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await Userlog.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Userlog.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local", // ✅ fixed
      isVerified: true,
    });

    res.status(201).json({
      message: "Signup successful",
      user: newUser,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
