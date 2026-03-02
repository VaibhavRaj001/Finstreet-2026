const GoogleStrategy = require("passport-google-oauth20").Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_URL
} = process.env;

const attachPassportStrategies = (passport) => {
  // Only attach Google strategy if credentials are configured
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && SERVER_URL) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: "https://finstreet-2026-production-9a1d.up.railway.app/api/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
          return done(null, { provider: "google", profile });
        }
      )
    );
    console.log("✓ Google OAuth strategy configured");
  } else {
    console.log("⚠ Google OAuth not configured (missing credentials or SERVER_URL)");
  }

};

module.exports = attachPassportStrategies;
