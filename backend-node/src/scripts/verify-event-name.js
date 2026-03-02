const mongoose = require("mongoose");
require("dotenv").config();
const Team = require("../models/team");
const Event = require("../models/event");
const User = require("../models/user");
const connectDB = require("../config/db");

async function verify() {
  try {
    await connectDB();
    console.log("Connected to database");

    // 1. Create a dummy user
    const user = await User.create({
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      password: "password123",
    });

    // 2. Create a dummy event
    const event = await Event.create({
      name: "Test Event " + Date.now(),
      description: "Test Description",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      registrationDeadline: new Date(Date.now() + 43200000),
      createdBy: user._id,
    });

    console.log(`Created event: ${event.name} (${event._id})`);

    // 3. Create a team (Simulating the controller logic)
    const team = await Team.create({
      name: "Test Team",
      event: event._id,
      eventName: event.name, // This is what we added
      members: [
        {
          user: user._id,
          role: "lead",
          joinedAt: new Date(),
        },
      ],
    });

    console.log(`Created team: ${team.name}`);
    console.log(`Stored eventName: ${team.eventName}`);

    // 4. Verify
    const fetchedTeam = await Team.findById(team._id).lean();
    if (fetchedTeam.eventName === event.name) {
      console.log("SUCCESS: eventName matches!");
    } else {
      console.log("FAILURE: eventName does not match!");
      console.log("Expected:", event.name);
      console.log("Got:", fetchedTeam.eventName);
    }

    // Cleanup
    await Team.findByIdAndDelete(team._id);
    await Event.findByIdAndDelete(event._id);
    await User.findByIdAndDelete(user._id);
    console.log("Cleanup complete");

    process.exit(0);
  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(1);
  }
}

verify();
