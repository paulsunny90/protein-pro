import { Router } from "express";
import passport from "passport";
import { loginUser, refreshToken, googleCallback, logoutUser } from "../controllers/auth.controller";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;
