const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { generateToken } = require("../utils/token.util");
const { sendEmail } = require("../utils/email.util");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { raw, hashed } = generateToken();

    await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: hashed,
      isVerified: false
    });

    const verifyLink = `http://localhost:5000/api/auth/verify-email/${raw}`;
    sendEmail(email, "Verify Email", verifyLink);

    return res.status(201).json({
      message: "Registered successfully. Please verify your email."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   VERIFY EMAIL
========================= */
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken
    });

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    user.isVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   LOGIN (ACCESS + REFRESH)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ error: "Please verify your email" });

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   REFRESH ACCESS TOKEN
========================= */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ error: "Refresh token required" });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
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
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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

    const resetLink = `http://localhost:5000/api/auth/reset-password/${raw}`;
    sendEmail(email, "Reset Password", resetLink);

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

