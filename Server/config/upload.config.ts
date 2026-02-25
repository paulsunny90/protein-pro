import multer from "multer";
import { storage } from "./cloudinary.config";

export const upload = multer({ storage });