const Event = require("../models/event");

/**
 * Get all events (public)
 */
exports.getAllEvents = async (req, res) => {
    try {
        const { status, active } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (active !== undefined) filter.isActive = active === "true";

        const events = await Event.find(filter)
            .sort({ startDate: 1 })
            .populate("createdBy", "name email");

        res.json({ events });
    } catch (err) {
        console.error("Get events error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get single event by ID (public)
 */
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ event });
    } catch (err) {
        console.error("Get event error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Create new event (admin only)
 */
exports.createEvent = async (req, res) => {
    try {
        console.log("Create event request body:", req.body);

        const {
            name,
            description,
            startDate,
            endDate,
            registrationDeadline,
            maxTeamSize,
            minTeamSize,
            venue
        } = req.body;

        // Validation with detailed error messages
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!description) missingFields.push("description");
        if (!startDate) missingFields.push("startDate");
        if (!endDate) missingFields.push("endDate");
        if (!registrationDeadline) missingFields.push("registrationDeadline");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        // Date validations
        const start = new Date(startDate);
        const end = new Date(endDate);
        const deadline = new Date(registrationDeadline);

        if (end < start) {
            return res.status(400).json({ error: "End date must be after start date" });
        }

        // Allow deadline to be on the same day as start (removed strict check)

        const event = await Event.create({
            name,
            description,
            startDate: start,
            endDate: end,
            registrationDeadline: deadline,
            maxTeamSize: maxTeamSize || 4,
            minTeamSize: minTeamSize || 1,
            venue: venue || "TBA",
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });
    } catch (err) {
        console.error("Create event error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Update event (admin only)
 */
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated directly
        delete updates._id;
        delete updates.createdBy;
        delete updates.createdAt;

        // Date validations if dates are being updated
        if (updates.startDate || updates.endDate) {
            const event = await Event.findById(id);
            if (!event) {
                return res.status(404).json({ error: "Event not found" });
            }

            const start = new Date(updates.startDate || event.startDate);
            const end = new Date(updates.endDate || event.endDate);

            if (end < start) {
                return res.status(400).json({ error: "End date must be after start date" });
            }
        }

        const event = await Event.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({
            message: "Event updated successfully",
            event
        });
    } catch (err) {
        console.error("Update event error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Delete event (admin only)
 */
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("Delete event error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Toggle event active status (admin only)
 */
exports.toggleEventStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        event.isActive = !event.isActive;
        await event.save();

        res.json({
            message: `Event ${event.isActive ? "activated" : "deactivated"} successfully`,
            event
        });
    } catch (err) {
        console.error("Toggle event status error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
