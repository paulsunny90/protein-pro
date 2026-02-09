// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";


// export const authMiddleware = ( req: Request,
//   res: Response,
//   next: NextFunction) => {
//     console.log(req.headers.authorization)
//     console.log(req.cookies,"cookie")
//   const token = req.cookies.accessToken;
//   console.log(token,"tokenn in auth middleware")
//   if (!token) return res.status(401).json({ message: "Not authenticated" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ message: "Token expired" });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    console.log("AUTH MIDDLEWARE CALLED FOR:", req.method, req.url);

    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log(token);
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log(token);
    }

    console.log(token);
    if (token) {
      console.log("TOKEN LENGTH 👉", token.length);
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "fallback_access_secret") as any;
    // req.user = decoded;
    req.user = {
      ...decoded,
      id: decoded.id || decoded._id
    };

    next();

  } catch (error) {
    console.error("AUTH ERROR 👉", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
