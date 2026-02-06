import jwt from "jsonwebtoken";

export const generateAccessToken = (user: any) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "50m" });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};
