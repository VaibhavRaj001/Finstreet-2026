const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        registrationDeadline: {
            type: Date,
            required: true
        },
        maxTeamSize: {
            type: Number,
            required: true,
            min: 1,
            default: 4
        },
        minTeamSize: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        venue: {
            type: String,
            default: "TBA"
        },
        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed", "cancelled"],
            default: "upcoming"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
