const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,

    resetToken: String,
    resetTokenExpiry: Date,
    refreshToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

