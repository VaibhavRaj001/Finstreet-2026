const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", controller.register);
router.get("/verify-email/:token", controller.verifyEmail);

router.post("/login", controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post("/logout", controller.logout);

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);

// JWT PROTECTED ROUTE
router.get("/profile", authMiddleware, async (req, res) => {
  const User = require("../models/user");
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

module.exports = router;


