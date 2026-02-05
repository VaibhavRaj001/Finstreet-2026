const router = require("express").Router();
const controller = require("../controllers/team.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Public route - get team info for join page
router.get("/invite/:inviteCode", controller.getTeamByInviteCode);

// Authenticated routes
router.post("/", authMiddleware, controller.createTeam);
router.post("/join/:inviteCode", authMiddleware, controller.joinTeam);
router.get("/my-teams", authMiddleware, controller.getMyTeams);
router.get("/:teamId", authMiddleware, controller.getTeamById);
router.post("/:teamId/leave", authMiddleware, controller.leaveTeam);
router.delete("/:teamId/members/:memberId", authMiddleware, controller.removeMember);

// Admin routes
router.get("/event/:eventId", authMiddleware, adminMiddleware, controller.getEventTeams);

module.exports = router;
