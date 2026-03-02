const mongoose = require("mongoose");
const crypto = require("crypto");

const teamMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["lead", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      lowercase: true,
      default: () => crypto.randomBytes(6).toString("hex"),
    },
    members: [teamMemberSchema],
    isComplete: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["forming", "registered", "disqualified"],
      default: "forming",
    },
  },
  { timestamps: true },
);

// Virtual for team lead
teamSchema.virtual("teamLead").get(function () {
  const lead = this.members.find((m) => m.role === "lead");
  return lead ? lead.user : null;
});

// Virtual for member count
teamSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Ensure virtuals are included in JSON
teamSchema.set("toJSON", { virtuals: true });
teamSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Team", teamSchema);
