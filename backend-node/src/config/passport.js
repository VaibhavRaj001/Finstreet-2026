const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SERVER_URL
} = process.env;

const attachPassportStrategies = (passport) => {
  // Only attach Google strategy if credentials are configured
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done) => {
          return done(null, { provider: "google", profile });
        }
      )
    );
    console.log("✓ Google OAuth strategy configured");
  } else {
    console.log("⚠ Google OAuth not configured (missing credentials)");
  }

  // Only attach GitHub strategy if credentials are configured
  if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/github/callback`,
          scope: ["user:email"]
        },
        (accessToken, refreshToken, profile, done) => {
          return done(null, { provider: "github", profile });
        }
      )
    );
    console.log("✓ GitHub OAuth strategy configured");
  } else {
    console.log("⚠ GitHub OAuth not configured (missing credentials)");
  }
};

module.exports = attachPassportStrategies;
