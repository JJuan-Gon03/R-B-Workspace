import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export function initPassport() {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g. http://localhost:8000/auth/google/callback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || null;
          const name = profile.displayName || "";

          // TODO: Replace with DB logic:
          // - find user by googleId or email
          // - create user if not exists (usually for register)
          const user = {
            googleId: profile.id,
            email,
            name,
          };

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
