const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { generateToken } = require("../utils/token.util");
const { sendEmail } = require("../utils/email.util");

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const isProd = process.env.NODE_ENV === "production";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const cookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
  maxAge: maxAgeMs
});

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user) => {
  const {
    password,
    resetToken,
    resetTokenExpiry,
    refreshToken,
    emailVerificationToken,
    __v,
    ...rest
  } = user.toObject();
  return rest;
};

const issueTokens = async (res, user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role, provider: user.provider },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TTL }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TTL }
  );

  user.refreshToken = hashToken(refreshToken);
  await user.save();

  res.cookie("accessToken", accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

  return { accessToken, refreshToken };
};

/* =========================
   REGISTER (LOCAL)
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      isVerified: true
    });

    const tokens = await issueTokens(res, user);

    return res.status(201).json({
      message: "Registered successfully",
      user: sanitizeUser(user),
      ...tokens
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   LOGIN (LOCAL)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const tokens = await issueTokens(res, user);

    res.json({
      message: "Login successful",
      user: sanitizeUser(user),
      ...tokens
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   ME
========================= */
exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user: sanitizeUser(user) });
};

/* =========================
   REFRESH ACCESS TOKEN
========================= */
exports.refreshToken = async (req, res) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incoming)
      return res.status(401).json({ error: "Refresh token required" });

    const payload = jwt.verify(incoming, process.env.JWT_REFRESH_SECRET);
    const hashedToken = hashToken(incoming);
    const user = await User.findOne({ _id: payload.id, refreshToken: hashedToken });

    if (!user)
      return res.status(403).json({ error: "Invalid refresh token" });

    const tokens = await issueTokens(res, user);
    res.json({ ...tokens });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Expired refresh token" });
  }
};

/* =========================
   LOGOUT
========================= */
exports.logout = async (req, res) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body.refreshToken;

    if (incoming) {
      const hashedToken = hashToken(incoming);
      const user = await User.findOne({ refreshToken: hashedToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken", cookieOptions(0));
    res.clearCookie("refreshToken", cookieOptions(0));

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   GOOGLE / GITHUB OAUTH CALLBACK
========================= */
exports.oauthCallback = async (req, res) => {
  try {
    const { provider, profile } = req.user || {};
    if (!provider || !profile)
      return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);

    const email = profile.emails?.[0]?.value;
    const image = profile.photos?.[0]?.value;
    const name = profile.displayName || profile.username || "User";

    if (!email)
      return res.redirect(`${CLIENT_URL}/login?error=email_required`);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        provider,
        providerId: profile.id,
        image,
        isVerified: true
      });
    } else {
      user.provider = provider;
      user.providerId = user.providerId || profile.id;
      user.image = user.image || image;
      user.isVerified = true;
      await user.save();
    }

    await issueTokens(res, user);

    return res.redirect(`${CLIENT_URL}/`);
  } catch (err) {
    console.error(err);
    return res.redirect(`${CLIENT_URL}/login?error=oauth_failed`);
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.json({ message: "If email exists, reset link sent" });

    const { raw, hashed } = generateToken();

    user.resetToken = hashed;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.SERVER_URL}/api/auth/reset-password/${raw}`;
    const resetPage = `${CLIENT_URL}/reset-password/${raw}`;
    await sendEmail(
      email,
      "Reset your password",
      `<p>Click the link below to reset your password. This link expires in 15 minutes.</p>
       <p><a href="${resetPage}">${resetPage}</a></p>`
    );

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

