const Team = require("../models/team");
const Event = require("../models/event");
const User = require("../models/user");

/**
 * Create a new team (authenticated users)
 */
exports.createTeam = async (req, res) => {
    try {
        const { name, eventId } = req.body;
        const userId = req.user.id;

        if (!name || !eventId) {
            return res.status(400).json({ error: "Team name and event are required" });
        }

        // Check if event exists and is active
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (!event.isActive) {
            return res.status(400).json({ error: "Event is not active" });
        }

        // Check registration deadline
        if (new Date() > event.registrationDeadline) {
            return res.status(400).json({ error: "Registration deadline has passed" });
        }

        // Check if user is already in a team for this event
        const existingTeam = await Team.findOne({
            event: eventId,
            "members.user": userId
        });

        if (existingTeam) {
            return res.status(400).json({
                error: "You are already in a team for this event",
                team: existingTeam
            });
        }

        // Create team with user as lead
        const team = await Team.create({
            name,
            event: eventId,
            members: [{
                user: userId,
                role: "lead",
                joinedAt: new Date()
            }]
        });

        // Populate for response
        await team.populate([
            { path: "event", select: "name maxTeamSize minTeamSize" },
            { path: "members.user", select: "name email image" }
        ]);

        const inviteUrl = `${process.env.CLIENT_URL}/join-team/${team.inviteCode}`;

        res.status(201).json({
            message: "Team created successfully",
            team,
            inviteUrl
        });
    } catch (err) {
        console.error("Create team error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get team by invite code (public - for join page)
 */
exports.getTeamByInviteCode = async (req, res) => {
    try {
        const { inviteCode } = req.params;

        const team = await Team.findOne({ inviteCode })
            .populate("event", "name maxTeamSize minTeamSize registrationDeadline isActive")
            .populate("members.user", "name email image");

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        res.json({ team });
    } catch (err) {
        console.error("Get team by invite code error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Join a team via invite code (authenticated users)
 */
exports.joinTeam = async (req, res) => {
    try {
        const { inviteCode } = req.params;
        const userId = req.user.id;

        const team = await Team.findOne({ inviteCode })
            .populate("event", "name maxTeamSize registrationDeadline isActive");

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if event is still active
        if (!team.event.isActive) {
            return res.status(400).json({ error: "Event is no longer active" });
        }

        // Check registration deadline
        if (new Date() > team.event.registrationDeadline) {
            return res.status(400).json({ error: "Registration deadline has passed" });
        }

        // Check if team is full
        if (team.members.length >= team.event.maxTeamSize) {
            return res.status(400).json({ error: "Team is already full" });
        }

        // Check if user is already in the team
        const isAlreadyMember = team.members.some(
            (m) => m.user.toString() === userId
        );

        if (isAlreadyMember) {
            return res.status(400).json({ error: "You are already in this team" });
        }

        // Check if user is in another team for the same event
        const existingTeam = await Team.findOne({
            event: team.event._id,
            "members.user": userId,
            _id: { $ne: team._id }
        });

        if (existingTeam) {
            return res.status(400).json({
                error: "You are already in another team for this event"
            });
        }

        // Add user to team
        team.members.push({
            user: userId,
            role: "member",
            joinedAt: new Date()
        });

        // Check if team is now complete
        if (team.members.length >= team.event.maxTeamSize) {
            team.isComplete = true;
        }

        await team.save();

        // Populate for response
        await team.populate("members.user", "name email image");

        res.json({
            message: "Successfully joined the team",
            team
        });
    } catch (err) {
        console.error("Join team error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Leave a team (authenticated users)
 */
exports.leaveTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        const memberIndex = team.members.findIndex(
            (m) => m.user.toString() === userId
        );

        if (memberIndex === -1) {
            return res.status(400).json({ error: "You are not a member of this team" });
        }

        const member = team.members[memberIndex];

        // If user is the lead
        if (member.role === "lead") {
            if (team.members.length === 1) {
                // Delete team if lead is the only member
                await Team.findByIdAndDelete(teamId);
                return res.json({ message: "Team deleted as you were the only member" });
            } else {
                // Transfer leadership to next member
                team.members.splice(memberIndex, 1);
                team.members[0].role = "lead";
            }
        } else {
            team.members.splice(memberIndex, 1);
        }

        team.isComplete = false;
        await team.save();

        res.json({ message: "Successfully left the team" });
    } catch (err) {
        console.error("Leave team error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get user's teams (authenticated users)
 */
exports.getMyTeams = async (req, res) => {
    try {
        const userId = req.user.id;

        const teams = await Team.find({ "members.user": userId })
            .populate("event", "name startDate endDate status isActive")
            .populate("members.user", "name email image");

        res.json({ teams });
    } catch (err) {
        console.error("Get my teams error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get team details (team members only)
 */
exports.getTeamById = async (req, res) => {
    try {
        const { teamId } = req.params;
        const userId = req.user.id;

        const team = await Team.findById(teamId)
            .populate("event")
            .populate("members.user", "name email image");

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if user is a member
        const isMember = team.members.some(
            (m) => m.user._id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({ error: "Access denied" });
        }

        const inviteUrl = `${process.env.CLIENT_URL}/join-team/${team.inviteCode}`;

        res.json({ team, inviteUrl });
    } catch (err) {
        console.error("Get team by ID error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Get all teams for an event (admin only)
 */
exports.getEventTeams = async (req, res) => {
    try {
        const { eventId } = req.params;

        const teams = await Team.find({ event: eventId })
            .populate("members.user", "name email image")
            .sort({ createdAt: -1 });

        res.json({ teams });
    } catch (err) {
        console.error("Get event teams error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * Remove a member from team (team lead only)
 */
exports.removeMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.params;
        const userId = req.user.id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if requester is team lead
        const requester = team.members.find(
            (m) => m.user.toString() === userId && m.role === "lead"
        );

        if (!requester) {
            return res.status(403).json({ error: "Only team lead can remove members" });
        }

        // Can't remove yourself using this endpoint
        if (memberId === userId) {
            return res.status(400).json({ error: "Use leave team to remove yourself" });
        }

        const memberIndex = team.members.findIndex(
            (m) => m.user.toString() === memberId
        );

        if (memberIndex === -1) {
            return res.status(404).json({ error: "Member not found in team" });
        }

        team.members.splice(memberIndex, 1);
        team.isComplete = false;
        await team.save();

        await team.populate("members.user", "name email image");

        res.json({
            message: "Member removed successfully",
            team
        });
    } catch (err) {
        console.error("Remove member error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
