const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local"
    },
    providerId: String,
    image: String,

    isVerified: { type: Boolean, default: false },
    emailVerificationToken: String,

    resetToken: String,
    resetTokenExpiry: Date,
    refreshToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

