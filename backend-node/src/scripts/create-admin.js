/**
 * Script to create an admin user
 * Run with: node src/scripts/create-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@finstreet.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            if (existingAdmin.role === "admin") {
                console.log("Admin user already exists:", ADMIN_EMAIL);
            } else {
                // Upgrade to admin
                existingAdmin.role = "admin";
                await existingAdmin.save();
                console.log("User upgraded to admin:", ADMIN_EMAIL);
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin",
                provider: "local",
                isVerified: true
            });

            console.log("Admin user created successfully!");
            console.log("Email:", ADMIN_EMAIL);
            console.log("Password:", ADMIN_PASSWORD);
        }

        await mongoose.disconnect();
        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
}

createAdmin();
