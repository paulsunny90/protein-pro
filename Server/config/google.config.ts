import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Userlog from "../models/user.model";
import dotenv from 'dotenv'
dotenv.config()


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await Userlog.findOne({ email });

        if (!user) {
          user = await Userlog.create({
            name: profile.displayName,
            email: email,
            googleID: profile.id,
            authProvider: "google",
            isVerified: true,
            role: "user",
          });
        } else if (!user.googleID) {
          // If user exists (signed up via local) but now logging in via Google
          user.googleID = profile.id;
          if (user.authProvider !== "google") {
            // Keep local if they have a password, or update to google if they don't?
            // Usually we can allow both.
          }
          await user.save();
        }

        // Pass the full user object or what's needed for token generation
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
