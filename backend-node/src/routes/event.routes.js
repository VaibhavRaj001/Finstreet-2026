const router = require("express").Router();
const controller = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// Public routes
router.get("/", controller.getAllEvents);
router.get("/:id", controller.getEventById);

// Admin routes (require authentication + admin role)
router.post("/", authMiddleware, adminMiddleware, controller.createEvent);
router.put("/:id", authMiddleware, adminMiddleware, controller.updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, controller.deleteEvent);
router.patch("/:id/toggle", authMiddleware, adminMiddleware, controller.toggleEventStatus);

module.exports = router;
