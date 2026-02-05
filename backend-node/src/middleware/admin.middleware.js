const User = require("../models/user");

/**
 * Admin middleware - must be used AFTER auth middleware
 * Checks if the authenticated user has admin role
 */
module.exports = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ error: "Admin access required" });
        }

        // Add full user object to request for convenience
        req.adminUser = user;
        next();
    } catch (err) {
        console.error("Admin middleware error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
